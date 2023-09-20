/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

function generateQRCode(url) {
    let qr_png = qr.image(url, { type: 'png' });
    qr_png.pipe(fs.createWriteStream('qr.png'));
}

inquirer
  .prompt([
    {
      type: 'input',
      name: 'question-1',
      message: 'Input URL:',
    },
  ])
  .then((answers) => {
    let url = answers["question-1"];
    generateQRCode(url);
    fs.writeFile('url.txt', url, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
  });