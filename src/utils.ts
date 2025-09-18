/*
Defines utility functions.
*/

import crypto from 'node:crypto';

let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
ALPHABET += '0123456789';


const getRandomString = (string_length = 32) => {
  /*
  Generates a random string of characters.
  */
  let output = '';
  let index = 0;
  while (index < string_length) {
    output += ALPHABET[crypto.randomInt(ALPHABET.length)];
    index++;
  }
  return output;
}

const maskCipherToken = (secret) => {
  /*
  Given a secret, generates a token using a mask.
  */
  const mask = getRandomString();
  const pairs = [];
  for (let i=0; i < secret.length; i++) {
    const secretIndex = ALPHABET.indexOf(secret[i]);
    const maskIndex = ALPHABET.indexOf(mask[i]);
    pairs.push([secretIndex, maskIndex]);
  }
  const sums = [];
  for (let j=0; j < pairs.length; j++) {
    const pair = pairs[j];
    sums.push(ALPHABET[(pair[0] + pair[1]) % ALPHABET.length]);
  }
  const cipher = sums.join('');
  return mask + cipher;
}

const unmaskCipherToken = (inputToken) => {
  /*
  Given a token, determines the secret by removing the mask.
  */
  const mask = inputToken.slice(0, 32);
  const token = inputToken.slice(32);
  const pairs = [];
  for (let i=0; i < token.length; i++) {
    pairs.push([ALPHABET.indexOf(token[i]), ALPHABET.indexOf(mask[i])]);
  }
  const secretArray = [];
  for (let j=0; j < pairs.length; j++) {
    let difference = pairs[j][0] - pairs[j][1];
    if (difference < 0) {
      difference = ALPHABET.length + difference;
    }
    secretArray.push(ALPHABET[difference]);
  }
  return secretArray.join('');
}

export { getRandomString, maskCipherToken, unmaskCipherToken };
