/*
Defines utility functions.
*/

import crypto from 'node:crypto';

let ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
ALPHABET += '0123456789';


const getRandomString = (string_length: number = 32) => {
  /*
  Generates a random string of characters.
  */
  let output: string = '';
  let index: number = 0;
  while (index < string_length) {
    output += ALPHABET[crypto.randomInt(ALPHABET.length)];
    index++;
  }
  return output;
}

const maskCipherToken = (secret: string) => {
  /*
  Given a secret, generates a token using a mask.
  */
  const mask: string = getRandomString();
  const pairs: number[][] = [];
  for (let index = 0; index < secret.length; index++) {
    const secretItem: string | undefined = secret[index];
    const maskItem: string | undefined = mask[index];
    if ((secretItem !== undefined) && (maskItem !== undefined)) {
      const secretIndex: number = ALPHABET.indexOf(secretItem);
      const maskIndex: number = ALPHABET.indexOf(maskItem);
      pairs.push([secretIndex, maskIndex]);
    }
  }
  const sums = [];
  for (let index = 0; index < pairs.length; index++) {
    const pair: Array<number> | undefined = pairs[index];
    if (pair !== undefined) {
      const firstItem: number | undefined = pair[0];
      const secondItem: number | undefined = pair[1];
      if ((firstItem !== undefined) && (secondItem !== undefined)) {
        sums.push(ALPHABET[(firstItem + secondItem) % ALPHABET.length]);
      }
    }
  }
  const cipher = sums.join('');
  return mask + cipher;
}

const unmaskCipherToken = (inputToken: string) => {
  /*
  Given a token, determines the secret by removing the mask.
  */

  const mask: string = inputToken.slice(0, 32);
  const token: string = inputToken.slice(32);

  const pairs: number[][] = [];
  for (let index = 0; index < token.length; index++) {
    const maskItem: string | undefined = mask[index];
    const tokenItem: string | undefined = token[index];
    if ((maskItem !== undefined) && (tokenItem !== undefined)) {
      pairs.push(
        [ALPHABET.indexOf(tokenItem), ALPHABET.indexOf(maskItem)]
      );
    }
  }

  const secretArray: Array<string> = [];
  pairs.forEach((item) => {
    const firstItem: number | undefined = item[0];
    const secondItem: number | undefined = item[1];
    if ((firstItem !== undefined) && (secondItem !== undefined)) {
      let difference: number = firstItem - secondItem;
      if (difference < 0) {
        difference = ALPHABET.length + difference;
      }
      const letter: string | undefined = ALPHABET[difference];
      if (letter !== undefined) {
        secretArray.push(letter);
      }
    }
  });

  return secretArray.join('');
}

export { getRandomString, maskCipherToken, unmaskCipherToken };
