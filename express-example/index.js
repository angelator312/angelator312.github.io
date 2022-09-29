const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const templatePath = path.join(__dirname, 'views');

// конфигурираме .html да се обработва като ejs темплейт
app.engine('.html', require('ejs').__express);

// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);

// конфигурираме директорията за статични файлове
app.use(express.static(path.join(__dirname, 'public')));

// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');

// Тестови данни
const fruits = ['apple', 'pear', 'banana'];

const phone = {
  brand: "Xiaomi",
  model: "Redmi",
}

const games = [
  { name: 'Minecraft', rating: 4 },
  { name: 'Fortnite', rating: 3 },
  { name: 'Игра с домат', rating: 5 },
];

// Конфигурираме /:path? да е пътя на който
// ще връщаме обработен темплейт
// :path - името на параметъра
// ? - означава че параметъра не е задължителен
app.get('/:path?', function(req, res){
  // Ако няма подаден параметър за път, използваме 'index'
  const template = req.params.path ?? 'index';
  const templateList = fs.readdirSync(templatePath).filter(t => !t.startsWith('_'));

  res.render(template, {
    templateList: templateList,
    fruits: fruits,
    phone: phone,
    games: games,
  });
});


// стартираме express
app.listen(8080,() => {
  console.log('Express started on port 8080');
});
