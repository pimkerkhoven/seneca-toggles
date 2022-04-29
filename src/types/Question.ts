// TODO: add assumption to Readme
// TODO: also have assumptions in comments surrounding code
// Assume answer is included in options
interface QuestionPart {
    options: string[]
    answer: string
}

interface Question {
    title: String
    parts: QuestionPart[]
}

export default Question
