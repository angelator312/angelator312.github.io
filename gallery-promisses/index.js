const {
  srandom, Filestore
} = require('./jsonwjs')
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const mime = require('mime-types');
const sharp = require('sharp')
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image')
  },
  filename: function (req, file, cb) {
    proverka(file, cb)
  }
})
const templatePath = path.join(__dirname, 'views');
const upload = multer({ dest: 'image/', storage });
const port = 8080
const cookieage = 60000 * 30
const session = new Filestore('session.json');
const registry = new Filestore('registry.json');
function proverka(file, cb) {
  fs.stat(`image/${file.originalname}`).then(() => {
    let nexte = file.originalname.substring(file.originalname.lastIndexOf('.'))
    let newname = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + new Date().getTime() + nexte;
    cb(null, newname)
  }).catch((err) => cb(null, file.originalname))
}
async function sendFile(path, res) {
  try {
    const data = await fs.readFile(`image/${path}`)
    const image = await sharp(data)
      .composite([
        { input: 'aletter.jpg', gravity: 'northwest' }
      ])
      .jpeg({ mozjpeg: true })
      .toBuffer()
    res.writeHead(200, { 'Content-Type': `image/jpeg` });
    res.write(image);
    return res.end();
  } catch (error) {
    res.writeHead(404, { 'Content-Type': `text/html; charset=utf-8` });
    res.write('<h1>404</h1>');
    res.write('няма такъв файл no such file');
    return res.end();
  }
}
app.engine('.html', require('ejs').__express);
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);
app.use(cookieParser());
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', async function (req, res) {
  const imageList = (await fs.readdir(`${process.cwd()}/image`)).filter(t => t.endsWith('.jpg') || t.endsWith('.png'))
  if (req.cookies.lognat) {
    const data = await session.getkey(req.cookies.lognat)
    res.render('index', {
      iList: imageList,
      username: data.username
    });
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
app.get('/registyrregistyr', async function (req, res) {
  if (req.query.password == req.query.password2) {
    let sid = srandom()
    await registry.addkey(req.query.username, {
      username: req.query.username,
      password: req.query.password
    })
    res.cookie('lognat', sid, { maxAge: cookieage })
    await session.addkey(sid, {
      username: req.query.username,
      password: req.query.password
    })
    res.redirect('/')


  }
})
app.get('/login', function (req, res) {
  res.render('login', {
    yorn: ''
  })
});
app.get('/logout', async function (req, res) {
  await session.deletekey(req.cookies.lognat)
  res.clearCookie('lognat');
  res.redirect('/');

})
app.get('/loginregister2', async function (req, res) {
  let valid = false;
  let username = req.query.username
  let password = req.query.password
  try {
    const data = await registry.getkey(username)
    console.log(data);
    if (data.username == username && data.password == password) {
      valid = true;
    } else {
      res.render('login', {
        yorn: 'има грешка в username или в password'
      })
      return;
    }
    if (valid) {
      let sid = srandom()
      await session.addkey(sid, { username, password })
      res.cookie('lognat', sid, { maxAge: cookieage })
      res.redirect('/')
      return;
    }
  } catch (error) {
    console.error(error);
    res.render('login', {
      yorn: 'има грешка в username или в password'
    })
    return;
  }
})
app.get('/upload', function (req, res) {
  res.render('upload', {
  })
});
app.post('/uploadimage', upload.single('myfile'), function (req, res, next) {
  res.redirect('/')
})
app.get('/dregistyr', async function (req, res) {
  const key = (
    await session.getkey(req.cookies.lognat)
  ).username
  registry.deletekey(key)
  await session.deletekey(key)
  res.clearCookie('lognat');
  res.redirect('/')
})
app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {

});