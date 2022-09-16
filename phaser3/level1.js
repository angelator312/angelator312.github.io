import Level from "./level.js";
class Level1 extends Level {
    static brplayr = 2
    static endscore = 100
    constructor() {
        super('level1', 1)
    }
}

export default Level1