// const fs = require('fs/promises');
const express = require('express');
const path = require('path');
const app = express();
const templatePath = path.join(__dirname, 'views');
const port = 8080;
const chasove={
    "10":{
        "19":{
            "10:00":"angel"
        }
    }
}
app.engine('.html', require('ejs').__express);
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', function (req, res) {
    let data=new Date().toISOString()
    const data2=data.substring(0,4)
    +'/'+data.substring(5,7)
    +'/'+data.substring(8,10)
    res.render('index', {
        data2,
    })
});
app.get('/:year/:month/:day',function (req, res){
    res.render('den', {
        chasove:chasove[req.params.month][req.params.day]
    })
});
app.listen(port, () => {
    console.log('Express started on port '+port);
});