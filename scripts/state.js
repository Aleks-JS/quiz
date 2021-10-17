class State {
    category = null;
    difficulty = 'Easy';
    questions = [];
    answers = {};
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
    constructor() {
    }
    init() {
        this.category = null;
        this.difficulty = 'Easy';
        this.questions = [];
        this.answers = {};
        this.count = 0;
        this.currentStep = 0;
        this.completed = false;
    }
}

export default State;