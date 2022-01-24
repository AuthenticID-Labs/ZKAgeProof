import { EtherscanProvider } from '@ethersproject/providers';
import ethers from 'ethers';
import ZKAgeProof from './contracts/ZKAgeProof.json';

const CONTRACT_ADDRESS = '0x6630C92AeaAbd97Cd2952B4F18791D6Cf17cAfc0';

/**
 * @param {EtherscanProvider} provider
 * @param {string} address
 * @returns {string} ZKProof
 */
export const getZKProof = async (provider, address) => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ZKAgeProof.abi, provider);
    const proof = await contract.getZKProof(address);
    return proof;
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
export const doZKProof = (age, hash, proof) => {
  for (let i = 0; i < age; i++) {
    hash = ethers.utils.keccak256(hash);
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
export const getZKHash = (age, timestamp, dob, secretPhrase) => {
  const ageAtEnrollment = Math.floor((timestamp - dob) / 1000 / 3600 / 24 / 365.25);
  const iterations = ageAtEnrollment - age;
  if (iterations <= 0) return secretPhrase;

  for (let i = 0; i < iterations; i++) {
    secretPhrase = ethers.utils.keccak256(secretPhrase);
  }
  return secretPhrase;
}

