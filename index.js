const ethers = require('ethers');
const ZKAgeProof = require('./contracts/ZKAgeProof.json');

const CONTRACT_ADDRESS = '0x6630C92AeaAbd97Cd2952B4F18791D6Cf17cAfc0';
let utf8Encode = new TextEncoder();

/**
 * @param {EtherscanProvider} provider
 * @param {string} address
 * @returns {string} ZKProof
 */
exports.getZKProof = async function(provider, address) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ZKAgeProof.abi, provider);
    const proof = await contract.getProof(address);
    return {
      proof: proof[0],
      timestamp: proof[1].toNumber()
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * @param {number} age
 * @param {string} hash
 * @param {string} proof
 * @returns {boolean} success
 */
exports.doZKProof = function(age, hash, proof) {
  for (let i = 0; i < age; i++) {
    hash = ethers.utils.keccak256(utf8Encode.encode(hash));
  }
  return hash === proof;
}

/**
 * @param {number} age
 * @param {timestamp} timestamp
 * @param {timestamp} dob
 * @param {string} secretPhrase
 * @returns {string} hash
 */
exports.getZKHash = function(age, timestamp, dob, secretPhrase) {
  const ageAtEnrollment = Math.floor((timestamp - dob) / 1000 / 3600 / 24 / 365.25);
  const iterations = ageAtEnrollment + 1 - age;
  if (iterations <= 0) return secretPhrase;

  for (let i = 0; i < iterations; i++) {
    secretPhrase = ethers.utils.keccak256(utf8Encode.encode(secretPhrase));
  }
  return secretPhrase;
}

