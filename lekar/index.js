// const fs = require('fs/promises');
const express = require('express');
const path = require('path');
const { Filestore } = require('./jsonwjs')
const chasove = new Filestore('chasove.json')
const app = express();
const templatePath = path.join(__dirname, 'views');
const port = 8080;
function breakdate(data) {
    return {
        year: data.getFullYear(),
        month: data.getMonth() + 1,
        day: data.getDate(),
    }
}
async function getday(year, month, day) {
    const data = await chasove.getkey(`${year}-${month}-${day}`)
    if (data == undefined) {
        const chasove2 = {}
        for (let i = 9; i < 20; i++) {
            chasove2[`${i}:00`] = {}
            chasove2[`${i}:30`] = {}
        }
        await chasove.addkey(`${year}-${month}-${day}`, chasove2)
    }
    return await chasove.getkey(`${year}-${month}-${day}`)
    /*
    if (chasove[year] && chasove[year][month] && chasove[year][month][day]) {
        return (chasove[year][month][day]);
    }else {
        if (!chasove[year]) {
            chasove[year] = {}
        }
        if (!chasove[year][month]) {
            chasove[year][month] = {}
        }
        if (!chasove[year][month][day]) {
            chasove[year][month][day] = {}
            for (let i = 9; i < 20; i++) {
                chasove[year][month][day][`${i}:00`] = {}
            }
        }
        return chasove[year][month][day]
        
    }*/
}
async function setchas(year, month, day, chas, obj) {
    const data = await chasove.getkey(`${year}-${month}-${day}`)
    data[chas] = obj
    chasove.addkey(`${year}-${month}-${day}` , data)
}
// конфигурации:
app.engine('.html', require('ejs').__express);
// конфигурираме къде се намират файловете с темплейти
app.set('views', templatePath);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
// Конфигурираме  разширението по подразбиране за темплейтите
app.set('view engine', '.html');
app.get('/', function (req, res) {
    let data = breakdate(new Date())
    const data2 = `${data.year}/${data.month}/${data.day}`
    res.redirect(data2)
});
app.get('/zapazichas/:year/:month/:day/:chas', function (req, res) {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let data = new Date(`${year}-${month}-${day}`);
    res.render('zapazichas', {
        ...breakdate(data),
        chas: req.params.chas,
    });
});
app.post('/zapazichas', async function (req, res) {
    let { year, month, day, chas, ime, typejiv } = req.body;
    await setchas(year, month, day, chas, { ime, typejiv })
    res.redirect(`/${year}/${month}/${day}`)
});
app.get('/:year/:month/:day', async function (req, res) {
    let year = req.params.year;
    let month = req.params.month;
    let day = req.params.day;
    let data = new Date(`${year}-${month}-${day}`);
    let utre = new Date(`${year}-${month}-${day}`);
    utre.setDate(utre.getDate() + 1);
    let vchera = new Date(`${year}-${month}-${day}`);
    vchera.setDate(vchera.getDate() - 1);
    res.render('den', {
        chasove: await getday(req.params.year, req.params.month, req.params.day),
        ...breakdate(data),
        vchera: breakdate(vchera),
        utre: breakdate(utre)
    });
});
app.listen(port, () => {
    console.log('Express started on port ' + port);
});