import { getRandomString } from './utils.ts';

describe('getRandomString', () => {
  it('should return random string of characters', async () => {
    const shortString = getRandomString(12);
    const mediumString = getRandomString(32);
    const longString = getRandomString(182);

    expect(shortString).toMatch(/^.{12}$/);
    expect(mediumString).toMatch(/^.{32}$/);
    expect(longString).toMatch(/^.{182}$/);
  });
});
