const fs = require('fs');
const express = require('express')
const path = require('path');
const { text } = require('express');
const app = express()
const port = 8080
let vids = {}
let cwdd= process.cwd().split('/')
cwdd = cwdd.slice(cwdd.length-2).join('/')
function listFiles(res) {
  
  let list = fs.readdirSync(process.cwd()).filter(t=>t.endsWith('.js')||t.endsWith('.html'));
  
  res.render('index.html', {
    list:list,
    cwd: cwdd
  });
  
  res.end();
}

function sendFile(path, res) {
  fs.readFile(path, function (err, data) {
    
    if (!err) {
      res.writeHead(200, { 'Content-Type': `text/${vids[path]}` });
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
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
  listFiles(res)
  
})
app.get('/:path', (req, res) => {
  sendFile(req.params.path, res)
})
app.listen(port, () => {
  
})