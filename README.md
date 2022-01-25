
```
npm i @authenticid-labs/zk-age-proof
```
or
```
yarn add @authenticid-labs/zk-age-proof
```

#### Usage

```
const {doZKProof, getZKHash, getZKProof} = require('@authenticid-labs/zk-age-proof');

const {proof, timestamp} = await getZKProof(provider, wallet_address);
const hash = getZKHash(age: number, timestamp: Date, dob: Date, secretPhrase: string);
const success = doZKProof(age: number, hash: string, proof: string);

```
