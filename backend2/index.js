const fs = require('fs');
const express = require('express')
const app = express()
const port = 8080
let vids = {}
function listFiles(res) {
  let list = fs.readdirSync(process.cwd());
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(`
    <main>
        <header> 
            <h1> <i>Index of&nbsp;</i>. <a href="/">${process.cwd()}/</a>  </h1>
        </header>
        <ul id="files">`)

  for (let index = 0; index < list.length; index++) {
    res.write(`  
            <li> <a href="/${list[index]}" title="${list[index]}" >${list[index]}</a> </li>
        `)
    vids[list[index]] = list[index].substring(list[index].lastIndexOf('.'), list[index].length)

  }
  res.write(`
            </ul>
        </main>`
  )
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
  console.log(`Example app listening on port ${port}`)
})