const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080
const templatePath = path.join(__dirname, 'views');
const imageList = fs.readdirSync(`${process.cwd()}`).filter(t => t.endsWith('.jpg') || t.endsWith('.png'))
const users = [{ username: 'angelator312', password: 'linux' }, { username: 'zaro', password: 'js' }]
let vids = {}
for (const i in imageList) {
  vids[imageList[i]] = imageList[i].substring(imageList[i].length - 3)
}
function sendFile(path, res) {
  fs.readFile(path, function (err, data) {

    if (!err) {
      res.writeHead(200, { 'Content-Type': `image/${vids[path]}` });
      res.write(data);
    } else {
      res.writeHead(404, { 'Content-Type': `text/html; charset=utf-8` });
      res.write('<h1>404</h1>');
      res.write('няма такъв файл no such file');
    }
    return res.end();
  });
}
app.engine('.html', require('ejs').__express);
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);
app.use(cookieParser());
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', function (req, res) {
  let username;
  if(req.cookies.lognat){
    username= JSON.parse(req.cookies.lognat).username
  }
  res.render('index', {
    iList: imageList,
    username,
  });

})
app.get('/login', function (req, res) {
  res.render('login', {
    yorn:''
  })
});
app.get('/logout',function (req,res) {
  res.clearCookie('lognat');
  res.redirect('/');
})
app.get('/loginregister', function (req, res) {
  let valid = false;
  let username = req.query.username
  let password = req.query.password
  for (const i in users) {
    if (users[i].username == username && users[i].password == password) {
      valid = true;
    }
  }
  if (valid) {
    res.cookie('lognat',JSON.stringify({username,password}))
    res.redirect('/')
  }else{
    res.render('login',{
      yorn:'има грешка в username или в password'
    })
  }
})
app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {
  console.log('Express started on port 8080');
});