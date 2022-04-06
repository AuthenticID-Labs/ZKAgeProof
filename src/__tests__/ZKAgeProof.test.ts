import { doZKProof, getZKHash, getZKProof } from '../index';

const secretPhrase = 'ROBERT SHAWN MITCHELL';
const zk = '0x04b54f1e5142e91281e86eef2d9cf3c7c6edca18b9b3d548a52afcc118171353';

test('Do ZK Proof', () => {
  expect(doZKProof(54, secretPhrase, zk)).toBe(true);
});

test('Do ZK Proof Plus One', () => {
  expect(doZKProof(55, secretPhrase, zk)).toBe(false);
});

test('Do Partial Proof', () => {
  const hash = getZKHash(21, new Date('13/Mar/2022'), new Date('18/Mar/1968'), secretPhrase);
  console.log('hash: ', hash)
  expect(doZKProof(21, hash, zk)).toBe(true);
});

test('Do False Proof', () => {
  const hash = getZKHash(65, new Date(), new Date('18/Mar/1968'), secretPhrase);
  expect(doZKProof(65, hash, zk)).toBe(false);
});
