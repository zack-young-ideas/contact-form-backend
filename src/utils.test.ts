import {
  getRandomString,
  maskCipherToken,
  unmaskCipherToken
} from './utils.ts';

describe('getRandomString', () => {
  it('should return random string of characters', () => {
    const shortString = getRandomString(12);
    const mediumString = getRandomString(32);
    const longString = getRandomString(182);

    expect(shortString).toMatch(/^.{12}$/);
    expect(mediumString).toMatch(/^.{32}$/);
    expect(longString).toMatch(/^.{182}$/);
  });
});

describe('maskCipherSecret', () => {
  it('should generate token given a secret value', () => {
    const secret = getRandomString();
    const token = maskCipherToken(secret);
    const decryptedValue = unmaskCipherToken(token);

    expect(secret).toBe(decryptedValue);
  });
});
