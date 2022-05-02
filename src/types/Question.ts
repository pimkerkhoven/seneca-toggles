export interface QuestionPart {
    options: string[]
    answer: string
}

export interface Question {
    title: String
    parts: QuestionPart[]
}
