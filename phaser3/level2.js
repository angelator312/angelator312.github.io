import Level from "./level.js";
class Level2  extends Level{
    static brplayr=1
    static peplus=[2,5,12];
    static endscore = 500
    constructor() {
        super('level2',2)
    }
}

export default Level2