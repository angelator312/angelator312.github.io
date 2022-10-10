const {
  srandom, Filestore
} = require('./jsonwjs')
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mime = require('mime-types')
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const templatePath = path.join(__dirname, 'views');
const upload = multer({ dest: 'image/', storage });
const port = 8080
const cookieage = 60000 * 30
const session = new Filestore('session.json');
const registry = new Filestore('registry.json');
function sendFile(path, res) {
  const type = mime.lookup( path );
  fs.readFile(`image/${path}`, function (err, data) {
    if (!err) {
      res.writeHead(200, { 'Content-Type': `image/${type}` });
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
    const imageList = fs.readdirSync(`${process.cwd()}/image`).filter(t => t.endsWith('.jpg') || t.endsWith('.png'))
    session.getkey(req.cookies.lognat, (err, data) => {
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
    registry.addkey(req.query.username, {
      username: req.query.username,
      password: req.query.password
    },
      (err) => {
        res.cookie('lognat', sid, { maxAge: cookieage })
        session.addkey(sid, {
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
  session.deletekey(req.cookies.lognat, () => {
    res.clearCookie('lognat');
    res.redirect('/');
  })

})
app.get('/loginregister2', function (req, res) {
  let valid = false;
  let username = req.query.username
  let password = req.query.password
  registry.getkey(username, (err, data) => {
    if (err) {
      res.render('login', {
        yorn: 'има грешка в username или в password'
      })
      return;
    }
    if (data.username == username && data.password == password) {
      valid = true;
    }
    if (valid) {
      let sid = srandom()
      session.addkey(sid, { username, password }, () => {
        res.cookie('lognat', sid, { maxAge: cookieage })
        res.redirect('/')
        return;
      }
      )
    }
  })
})
app.get('/upload', function (req, res) {
  res.render('upload', {
  })
});
app.post('/uploadimage', upload.single('myfile'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  res.redirect('/')
})

app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {

});