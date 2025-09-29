// eslint-disable-next-line
import fs from 'fs';

import { renderTemplate } from './emailUtils';

jest.mock('fs', () => ({
  readFileSync: () => {
    const data = '<!DOCTYPE html>\n'
               + '<body>\n'
               + '  <h1>{{ title }}</h1>\n'
               + '  <p>The quick brown {{ variable1 }} jumps over the '
               + 'lazy {{ variable2 }}</p>\n'
               + '</body>\n';
    return data;
  },
}));

afterEach(() => jest.resetAllMocks());

describe('renderTemplate', () => {
  it('should render templates with the given variables', async () => {
    const actualOutput = await renderTemplate(
      'template.html',
      {
        title: 'Welcome To The Site',
        variable1: 'fox',
        variable2: 'dog',
      }
    );
    const expectedOutput = '<!DOCTYPE html>\n'
                         + '<body>\n'
                         + '  <h1>Welcome To The Site</h1>\n'
                         + '  <p>The quick brown fox jumps over the lazy '
                         + 'dog</p>\n'
                         + '</body>\n';

    expect(actualOutput).toBe(expectedOutput);
  });
});
