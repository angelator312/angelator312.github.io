const fs = require('fs');
let sessionfile = './wjs.json'
let registryfile = 'registry.json'
function srandom() {
    let strg = '';
    for (let index = 0; index < 22; index++) {
        strg += Math.floor(Math.random() * 10)
    }
    return strg
}
function write(file, obj, callback) {
    fs.writeFile(file, JSON.stringify(obj,null,2), function (err) {
        if (err) {
            console.log(err);
        }
        callback(err)
    })
}
function read(file, callback) {
    fs.readFile(file, function (err, data) {
        if (err){
            console.log(err)
            callback(err)
        }else{
            callback(err, JSON.parse(data))
        }
    })
}
function addsessionkey(key, value, callback) {
    read(sessionfile, (err, data) => {
        data[key] = value;
        write(sessionfile, data, callback)
    })
}
function deletesessionkey(key, callback) {
    read(sessionfile, (err, data) => {
        delete data[key]
        write(sessionfile, data, callback)
    })
}
function setsessionfile(newfile) {
    sessionfile = newfile
}
function getsessionkey(key, callback) {
    read(sessionfile, (err, data) => {
        if (err) {
            callback(err)
        } else {
            callback(err, data[key])
        }
    })
}
function addregystrykey(key, value, callback) {
    read(registryfile, (err, data) => {
        data[key] = value;
        write(registryfile, data, callback)
    })
}
function deleteregistrykey(key, callback) {
    read(registryfile, (err, data) => {
        delete data[key]
        write(registryfile, data, callback)
    })
}
function setregistryfile(newfile) {
    registryfile = newfile
}
function getregistrykey(key, callback) {
    read(registryfile, (err, data) => {
        if (err) {
            callback(err)
        } else {
            callback(err, data[key])
        }
    })
}
module.exports = {
    addsessionkey, deletesessionkey, setsessionfile, getsessionkey,
    addregystrykey, deleteregistrykey, setregistryfile, getregistrykey,
    srandom
}