// TODO: add assumption to Readme
// TODO: also have assumptions in comments surrounding code
// Assume answer is included in options
export interface QuestionPart {
    options: string[]
    answer: string
}

export interface Question {
    title: String
    parts: QuestionPart[]
}
