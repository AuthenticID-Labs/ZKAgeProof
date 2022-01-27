import { ethers, Signer, providers } from 'ethers';
import * as ZKAgeProof from './contracts/ZKAgeProof.json';
import * as encoding from 'text-encoding';

const CONTRACT_ADDRESS = '0x6630C92AeaAbd97Cd2952B4F18791D6Cf17cAfc0';
const utf8Encode = new encoding.TextEncoder();

export type ProofPackage = {
  proof: string;
  timestamp: number;
};

/**
 * @param {EtherscanProvider} provider
 * @param {string} address
 * @returns {ProofPackage} ZKProof
 */
export const getZKProof = async (provider: providers.Provider | Signer, address: string): Promise<ProofPackage> => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ZKAgeProof.abi, provider);
    const proof = await contract.getProof(address);
    return {
      proof: proof[0],
      timestamp: proof[1].toNumber(),
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @param {number} age
 * @param {string} hash
 * @param {string} proof
 * @returns {boolean} success
 */
export const doZKProof = (age: number, hash: string, proof: string): boolean => {
  for (let i = 0; i < age; i++) {
    hash = ethers.utils.keccak256(utf8Encode.encode(hash));
  }
  return hash === proof;
};

/**
 * @param {number} age
 * @param {Date} timestamp
 * @param {Date} dob
 * @param {string} secretPhrase
 * @returns {string} hash
 */
export const getZKHash = (age: number, timestamp: Date, dob: Date, secretPhrase: string): string => {
  const ageAtEnrollment = Math.floor((timestamp.getTime() - dob.getTime()) / 1000 / 3600 / 24 / 365.25);
  const iterations = ageAtEnrollment + 1 - age;
  if (iterations <= 0) return secretPhrase;

  for (let i = 0; i < iterations; i++) {
    secretPhrase = ethers.utils.keccak256(utf8Encode.encode(secretPhrase));
  }
  return secretPhrase;
};
