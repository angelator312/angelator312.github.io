const {
  Filestore
} = require('./jsonwjs')
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const cookieParser = require('cookie-parser');
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
async function textList() {
  return (await fs.readdir(`${process.cwd()}/texts`)).filter(t => t.endsWith('.txt'))
}
function translate1(string) {
    const azbuka={
      а:'a',б:`b`,'в':'v', 'г':'g', 'д':'d', 'е':'e',
      ж:'g',з:'z',и:'i',к:'k',л:'l',м:'m',н:'n',
      о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f'
      ,х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sht',я:'ia',
      А:'A',Б:`B`,В:'V', Г:'G', Д:'D', Е:'E',
      Ж:'G',З:'Z',И:'I',К:'K',Л:'L',М:'M',Н:'N',
      О:'O',П:'P',Р:'R',С:'S',Т:'T',У:'U',Ф:'F'
      ,Х:'H',Ц:'Ts',Ч:'CH',Ш:'SH',Щ:'Sht',Я:'Ya',
      ъ:'a',й:'y'
    }
    if (string==' ') {
      return string
    }else if (string=='.'){
      return string+' '
    }else if (string==','){
      return string+' '
    }else if (string==' '){
      return string
    }else if (string=='?'){
      return string+' '
    }else if (string=='\\'){
      return '<br>'
    
    } else { 
      return azbuka[string];
    }
}
function translate(string) {
  let astr = string.split('')
  let result=[];
  for (const e of astr) {
    result.push(translate1(e))
  }
  return result.join('')
}
function proverka(file, cb) {
  fs.stat(`texts/${file.originalname}`).then(() => {
    let nexte = file.originalname.substring(file.originalname.lastIndexOf('.'))
    let newname = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + new Date().getTime() + nexte;
    cb(null, newname)
  }).catch((err) => cb(null, file.originalname))
}
async function sendFile(path, res) {
  try {
    const data = await fs.readFile(`texts/${path}`)
    res.writeHead(200, { 'Content-Type': `text/plain; charset=utf-8` });
    const data2=translate(data.toString())
    res.write(data2);
    return res.end();
  } catch (error) {
    res.writeHead(404, { 'Content-Type': `text/html; charset=utf-8` });
    res.write('<h1>404</h1>');
    res.write('няма такъв файл no such file');
    return res.end();
  }
}
async function searchfile(search) {
  let result = []
  if (!search) { return { result, searchreg: '' } }
  const list = await textList()
  search = search.replace(/\s+/g, '\\s+')
  for (const item of list) {
    const file = await fs.readFile(`texts/${item}`)
    const rg = new RegExp(`${search}`, 'i')
    const sr = file.toString().match(rg)
    if (sr) {
      let miasto = sr.index
      let duma = sr[0]
      let otriazyk1 = sr.input.substring(miasto - 20, miasto)
      let otriazyk3 = sr.input.substring(miasto + duma.length, miasto + duma.length + 20)
      result.push({ sm: sr, miasto, file: item, otriazyk1, duma, otriazyk3 })
    }
  }
  return { result, searchreg: search }
}
app.engine('.html', require('ejs').__express);

app.use(express.static(path.join(__dirname, 'public')));
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);
app.use(cookieParser());
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', async function (req, res) {
  if (req.cookies.lognat) {
    const data = await session.getkey(req.cookies.lognat)
    res.render('index', {
      iList: await textList(),
      username: data.username
    });
  } else {
    res.render('index', {
      iList: await textList(),
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
app.get('/search', async function (req, res) {
  let search = req.query.search
  let result;
  let search2;
  search2 = await searchfile(search)
  res.render('search', {
    search,
    ...search2,
  })
});
app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {

});