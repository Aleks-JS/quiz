class State {
    category = null;
    difficulty = 'Easy';
    questions = [];
    _answers = {};
    count = 0;
    currentStep = 0;
    completed = false;
    get answers() {
        return this._answers;
    }
    set answers(value) {
        this._answers[this.currentStep] = value;
        this.completed = this.questions.length === this.currentStep + 1;
    }
}

export default State;