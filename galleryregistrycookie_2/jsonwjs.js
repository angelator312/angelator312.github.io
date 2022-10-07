const fs = require('fs');
function srandom() {
    let strg = '';
    for (let index = 0; index < 22; index++) {
        strg += Math.floor(Math.random() * 10)
    }
    return strg
}
class Filestore {
    constructor(file) {
        this.file = file
    }
    write(obj, callback) {
        fs.writeFile(this.file, JSON.stringify(obj, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
            callback(err)
        })
    }
    read(callback) {
        fs.readFile(this.file, function (err, data) {
            if (err) {
                console.log(err)
                callback(err)
            } else {
                callback(err, JSON.parse(data))
            }
        })
    }
    addkey(key, value, callback) {
        this.read( (err, data) => {
            data[key] = value;
            this.write( data, callback)
        })
    }
    deletekey(key, callback) {
        this.read( (err, data) => {
            delete data[key]
            this.write( data, callback)
        })
    }
    getkey(key, callback) {
        this.read( (err, data) => {
            if (err) {
                callback(err)
            } else {
                callback(err, data[key])
            }
        })
    }
}
module.exports = {
    Filestore,
    srandom
}