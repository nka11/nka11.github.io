import DataHelper from "./DataHelper";
import { Accomplishments } from "./Model";
import SkillsData from "./SkillsData"

// const skills = 

export default class DataHelperImpl implements DataHelper {
    public accomplishments: Array<Accomplishments> = [];
    constructor() {
        fetch('/CV/accomplishments.json').then((data) => {
            data.json().then((accomplishments) => {
                this.accomplishments = accomplishments;
            })
        })
    }
    getSkills(): SkillsData[] {
        const result: Array<SkillsData> = []

        return result;
    }

}