const fs = require('fs/promises');
class Filestore {
    constructor(file) {
        this.file = file
    }
    write(obj) {
        return fs.writeFile(this.file, JSON.stringify(obj, null, 2))
    }
    async read() {
        return JSON.parse(await fs.readFile(this.file))
    }
    async addkey(key, value) {
        const data = await this.read()
        data[key] = value
        return this.write(data)
    }
    async deletekey(key) {
        const data = await this.read()
        delete data[key]
        return this.write(data)

    }
    async getkey(key) {
        const data = await this.read()
        return data[key]
    }
}
module.exports = {
    Filestore
}