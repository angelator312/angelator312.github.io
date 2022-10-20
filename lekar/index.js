// const fs = require('fs/promises');
const express = require('express');
const path = require('path');
const app = express();
const templatePath = path.join(__dirname, 'views');
const port = 8080;
const chasove = {
    "2022": {
        "10": {

        }
    }
}
function getday(year, month, day) {
    if (chasove[year][month][day]) {
        return (chasove[year][month][day])
    } else {
        if (!chasove[year]) {
            chasove[year] = {}
        }
        if (!chasove[year][month]) {
            chasove[year][month] = {}
        }
        if (!chasove[year][month][day]) {
            chasove[year][month][day] = {}
            for (let i = 9; i < 20; i++) {
                chasove[year][month][day][`${i}:00`] = ''
            }
        }
        return chasove[year][month][day]
    }
}
app.engine('.html', require('ejs').__express);
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);

app.use(express.static(path.join(__dirname, 'public')));
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', function (req, res) {
    let data = new Date().toISOString()
    const data2 = data.substring(0, 4)
        + '/' + data.substring(5, 7)
        + '/' + data.substring(8, 10)
    res.render('index', {
        data2,
    })
});
app.get('/:year/:month/:day', function (req, res) {
    let year=req.params.year
    let month= req.params.month
    let day= req.params.day
    let data=new Date(`${year}-${month}-${day}`)
    let utre=new Date(`${year}-${month}-${day}`)
    utre.setDate(utre.getDate()+1)
    let vchera=new Date(`${year}-${month}-${day}`)
    vchera.setDate(utre.getDate()-1)
    res.render('den', {
        chasove: getday(req.params.year, req.params.month, req.params.day),
        year: data.getFullYear(),
        month: req.params.month,
        day: req.params.day
    })
});
app.listen(port, () => {
    console.log('Express started on port ' + port);
});