/*
Defines utility functions.
*/

const crypto = require('node:crypto');

const getRandomString = (string_length = 32) => {
  /*
  Generates a random string of characters.
  */
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  alphabet += '0123456789!@#$%^&*(){}?;';
  let output = '';
  let index = 0;
  while (index < string_length) {
    output += alphabet[crypto.randomInt(alphabet.length)];
    index++;
  }
  return output;
}

export { getRandomString };
