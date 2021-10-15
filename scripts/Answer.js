class Answer {
    correctAnswer;
    receivedAnswer;
    isCorrect;
    id;
    constructor(question, answer) {
        this.prepareAnswer(question, answer)
    }

    prepareAnswer(question, answer) {
        this.correctAnswer = Object.keys(question.correct_answers).find(
            answer => question.correct_answers[answer] === 'true'
        ).replace('_correct', '')
        this.receivedAnswer = answer;
        this.isCorrect = this.correctAnswer === this.receivedAnswer;
        this.id = question.id
    }
}

export default Answer;