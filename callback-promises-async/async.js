// Записваме си началното време, за да може да отпечатваме колко време е минало от старта
const startTime = new Date();
// Променлива която ще съхранява данните при четене и запис
let store = {};

// Променлива която контролира дали ще връщаме грешка при четене/писане
let simulateError = false;

// Функция която отпечатва съобщение в конзолата, като добавя
// колко милисекунди са изминали от началото на програмата
function log() {
  const msSinceStart = new Date().getTime() - startTime.getTime();
  console.log("[%sms]", msSinceStart, ...arguments);
}

// read - симулира четене от файл, което е бавно и отнема време
function read() {
  return new Promise((ok, fail) => {
    //Използваме setTimeout за да симулираме бавно четене
    setTimeout(() => {
      log("Симулиране на четене");
      if (simulateError) {
        fail(new Error("Грешка при четене"));
      } else {
        ok(store);
      }
    }, 1000);
  });
}

// write - симулира запис от файл, което е бавно и отнема време
function write(obj) {
  return new Promise((ok, fail) => {
    setTimeout(() => {
      log("Симулиране на запис");
      if (simulateError) {
        fail(new Error("Грешка при запис"));
      } else {
        store = obj;
        ok(store);
      }
    }, 1000);
  });
}

// update - симулира обновяване на файл, като използва read и write
async function update(key, value) {
  let obj = await read();
  obj[key] = value;
  return write(obj);
}

async function test() {
  console.log("------- Стъпка 1, тест без грешка -------");
  try {
    await update("test1", "value1")
    log(`Ключ test1 е обновен`);

    console.log("------- Стъпка 2, тест със грешка -------");
    simulateError = true;
    try {
      await update("test2", "value2")
      log(`Ключ test2 е обновен`);
    } catch (err) {
      log(`Грешка при обновяване на ключ  test2 : ${err}`);
    }
  } catch (err) {
      log(`Грешка при обновяване на ключ  test1 : ${err}`);
  }
}

test()