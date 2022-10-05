const fs = require("fs");


function main(){
  fs.readFile(__filename, (err, data) => {
    if (err){
      console.error('Грешка при четене:', err);
    } else {
      console.log('Прочетени %s символа', data.length)
    }
  })
}

main();