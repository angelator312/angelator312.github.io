var http = require('http');
var fs = require('fs');
const { log } = require('console');
let vids={}
function listFiles(res) {
    let list= fs.readdirSync(process.cwd());
    res.writeHead(200, {'Content-Type': 'text/html'});
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
          vids[list[index]]=list[index].substring(list[index].lastIndexOf('.'), list[index].length)

        }
        res.write(`
            </ul>
        </main>`
        )
     res.end();
}

function sendFile(path, res) {
  fs.readFile(path.substring(1,path.length), function(err, data) {
    res.writeHead(200, {'Content-Type': `text/${vids[path]}`});
    res.write(data);
    return res.end();
  });
}

http.createServer(function (req, res) {
  //Open a file on the server and return its content:
  if(req.url == '/') {
    listFiles(res);
  } else if(req.url!='/favicon.ico'&&req.url!='/') {
    sendFile(req.url,res);
  }

}).listen(8080);