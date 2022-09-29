const fs = require('fs');
const express = require('express')
const path = require('path')
const app = express()
const port = 8080
let vids = {}
function listFiles(res) {
  console.log('listFiles');
  let list = fs.readdirSync(process.cwd());
  console.log('listFiles2');
  res.render('index.html', {
    list:list
  });
  console.log('listFiles3');
  res.end();
}

function sendFile(path, res) {
  fs.readFile(path, function (err, data) {
    console.log('sendFile');
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
  console.log('stranno');
})
app.get('/:path', (req, res) => {
  sendFile(req.params.path, res)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})