class Answer {
    correctAnswer;
    correctAnswerValue;
    receivedAnswer;
    receivedAnswerValue;
    isCorrect;
    id;
    constructor(question, answer) {
        this.prepareAnswer(question, answer)
    }

    prepareAnswer(question, answer) {
        const correctAnswers = [];        
        this.correctAnswer = Object.keys(question.correct_answers).filter(
            answer => question.correct_answers[answer] === 'true'
        ).map(value => {
            const result = value.replace('_correct', '');
            correctAnswers.push(question.answers[result]);
            return result
        }).join();        
        this.correctAnswerValue = correctAnswers.join();
        this.receivedAnswer = answer;
        this.receivedAnswerValue = answer.split(',').map(a => question.answers[a]).join();
        this.isCorrect = this.correctAnswer === this.receivedAnswer;
        this.id = question.id
    }
}

export default Answer;