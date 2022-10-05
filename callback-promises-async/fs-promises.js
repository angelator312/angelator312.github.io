const fs = require("fs/promises");


async function main(){
  try {
    let data = await fs.readFile(__filename)
    console.log('Прочетени %s символа', data.length)
  } catch(err) {
    console.error('Грешка при четене:', err);
  }
}

main();