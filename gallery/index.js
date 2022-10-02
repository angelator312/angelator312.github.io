const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port=8080
const templatePath = path.join(__dirname, 'views');
const imageList=fs.readdirSync(`${process.cwd()}`).filter(t =>t.endsWith('.jpg')||t.endsWith('.png'))
let vids = {}
for (const i in imageList) {
  vids[imageList[i]]=imageList[i].substring(imageList[i].length-3)
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

// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/',function (req,res) {
    res.render('index', {
        iList: imageList
      });
    
})
app.get('/:path?', function (req, res) {
  sendFile(req.params.path, res)
});
app.listen(port, () => {
  console.log('Express started on port 8080');
});