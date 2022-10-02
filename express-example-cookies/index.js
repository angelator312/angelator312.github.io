const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');


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


// конфигурираме exdpress да може да чете cookies, за изпращането им
// не е необходимо нищо допълнително
app.use(cookieParser());


// Конфигурираме /:path? да е пътя на който
// ще връщаме обработен темплейт
// :path - името на параметъра
// ? - означава че параметъра не е задължителен
app.get('/', function(req, res){
  // Ако няма подаден параметър за път, използваме 'index'
  res.render('index', {
    receivedCookies: req.cookies,
  });

});

//
app.get('/set-cookie', function(req, res){
  res.cookie('biskvitka1', '1')
  res.cookie('biskvitka2', '2', { expires: new Date(Date.now() + 60000)})

  res.redirect('/');
});


app.get('/clear-cookie', function(req, res){
  res.clearCookie('biskvitka1')
  res.clearCookie('biskvitka2')

  res.redirect('/');
});


// стартираме express
app.listen(8080,() => {
  console.log('Express started on port 8080');
});
