const {
  addsessionkey, deletesessionkey, srandom, setsessionfile, getsessionkey,
  addregystrykey, deleteregistrykey, setregistryfile, getregistrykey
} = require('./jsonwjs')
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
setsessionfile('session.json')
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
  if (req.cookies.lognat) {
    getsessionkey(req.cookies.lognat, (err, data) => {
      res.render('index', {
        iList: imageList,
        username: data.username
      });
    }
    )
  } else {
    res.render('index', {
      iList: imageList,
      username: null
    })
  }

})
app.get('/registyr', function (req, res) {
  res.render('registry', {
    yorn: null
  })
})
app.get('/registyrregistyr', function (req, res) {
  if (req.query.password == req.query.password2) {
    let sid = srandom()
    addregystrykey(req.query.username, {
      username: req.query.username,
      password: req.query.password
    },
      (err) => {
        res.cookie('lognat', sid)
        addsessionkey(sid, {
          username: req.query.username,
          password: req.query.password
        }, () => res.redirect('/'))
      }
    )
  }
})
app.get('/login', function (req, res) {
  res.render('login', {
    yorn: ''
  })
});
app.get('/logout', function (req, res) {
  deletesessionkey(req.cookies.lognat, () => {
    res.clearCookie('lognat');
    res.redirect('/');
  })

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
    let sid = srandom()
    addsessionkey(sid, { username, password }, () => {
      res.cookie('lognat', sid)
      res.redirect('/')
    }
    )
  } else {
    res.render('login', {
      yorn: 'има грешка в username или в password'
    })
  }
})
app.get('/loginregister2', function (req, res) {
  console.log('login2');
  let valid = false;
  let username = req.query.username
  let password = req.query.password
  getregistrykey(username, (err, data) => {
    console.log(data);
    if (data.username == username && data.password == password) {
      valid = true;
    }
    if (valid) {
      let sid = srandom()
      addsessionkey(sid, { username, password }, () => {
        res.cookie('lognat', sid)
        res.redirect('/')
        return;
      }
      )
    } else {
      res.render('login', {
        yorn: 'има грешка в username или в password'
      })
      return;
    }
  })
})
app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {
  console.log('Express started on port 8080');
});