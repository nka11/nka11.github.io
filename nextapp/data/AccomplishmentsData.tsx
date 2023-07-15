import SkillsData from "./SkillsData"

export interface AccomplishmentsData {
    summary: string
    description?: Array<string>
    start_date: number
    end_date: number
    skills?: Array<SkillsData>
}

export default AccomplishmentsData