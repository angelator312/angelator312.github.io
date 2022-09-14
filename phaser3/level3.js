import Levelbosses from "./levelboss.js";
class Level3  extends Levelbosses{
    static brplayr=1
    static peplus=[2,5,12];
    static pluscoins=100
    static Armor =60
    constructor() {
        super('level3',3)
    }
}

export default Level3