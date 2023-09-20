// var generateName = require('sillyname'); // CommonJS

import generateName from 'sillyname'; // ES6 -> type: module in package.json
import superheroes from 'superheroes';

async function delay(timeout) {
    return new Promise(function(resolve, _reject) {
        setTimeout(resolve, timeout);
    });
}

async function main() {
    for(var i = 0; i < 10; i++) {
        console.log(`${generateName()} -------- ${superheroes.random()}`);
        await delay(1000);
    }
}

main();
