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
function read(callback) {
  //Използваме setTimeout за да симулираме бавно четене
  setTimeout(() => {
    log("Симулиране на четене");
    if (simulateError) {
      callback(new Error("Грешка при четене"));
    } else {
      callback(null, store);
    }
  }, 1000);
}

// write - симулира запис от файл, което е бавно и отнема време
function write(obj, callback) {
  //Използваме setTimeout за да симулираме бавен запис
  setTimeout(() => {
    log("Симулиране на запис");
    if (simulateError) {
      callback(new Error("Грешка при запис"));
    } else {
      store = obj;
      callback(null, store);
    }
  }, 1000);
}

// update - симулира обновяване на файл, като използва read и write
function update(key, value, callback) {
  read((err, obj) => {
    if (err) {
      callback(err);
      return;
    }
    obj[key] = value;
    write(obj, callback);
  });
}

function test() {
  console.log("------- Стъпка 1, тест без грешка -------");
  update("test1", "value1", (err) => {
    if (err) {
      log(`Грешка при обновяване на ключ  test1 : ${err}`);
    } else {
      log(`Ключ test1 е обновен`);
    }

    console.log("------- Стъпка 2, тест със грешка -------");
    simulateError = true;
    update("test2", "value2", (err) => {
      if (err) {
        log(`Грешка при обновяване на ключ  test2 : ${err}`);
      } else {
        log(`Ключ test2 е обновен`);
      }
    });
  });
}

test();