/*
Defines a utility function used to render email templates.
*/

import fs from 'fs';

interface UnknownVariables {
  [key: string]: string;
}

const renderTemplate = async (
  templatePath: string,
  templateVariables: UnknownVariables
) => {
  /*
  Renders a template with the given template variables.
  */
  let output: string = '';
  await fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
      throw Error(`File ${templatePath} doesn't exist`);
    } else {
      output = data;
      for (const key in templateVariables) {
        output = output.split(`{{ ${key} }}`).join(templateVariables[key]);
      }
    }
  });
  return output;
}

export { renderTemplate };
