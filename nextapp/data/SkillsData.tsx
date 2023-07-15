enum SkillPractice {
    "Novice",
    "Advanced Beginner",
    "Competent",
    "Proficient",
    "Expert"
}
export interface SkillsData {
    name: string
    practice?: SkillPractice
}

export default SkillsData