import {
    APP
} from "./variables.js";
import Answer from "./Answer.js";
class QuizStepCard {
    constructor(state) {
        this.STATE = state;
    }

    nextStep() {
        this.STATE.currentStep += 1;
        this.renderCard();
    }

    addAnswerItem(type, key, value) {
        const label = document.createElement('label');
        label.classList.add('list-group-item');
        const answer = document.createElement('input');
        answer.type = type;
        answer.name = 'answer';
        answer.classList.add('form-check-input', 'me-1');
        answer.value = key;
        answer.id = key;
        if (type === 'radio') {
            answer.required = true
        }
        label.textContent = value;
        label.prepend(answer);
        return label;
    }

    setRequired(form) {
        const someChecked = !![...form.answer].some(input => input.checked);
        !![...form.answer].filter(input => input.type !== 'radio').forEach(input => {
            const required = someChecked ? '' : 'You must select at least one value'
            input.setCustomValidity(required)
        })

    }

    renderCard() {
        return new Promise((resolve, reject) => {
            const nextStep = () => {
                const {
                    STATE
                } = this;
                STATE.currentStep += 1;
                const q = STATE.questions[STATE.currentStep - 1];
                const isMmultiple = q.multiple_correct_answers === 'true';
                let resultHtml = `
                <div class="container">
                <h3 class="mt-4 mb-4 display-3">Quiz</h3>
                    <div class="card">
                        <h5 class="card-header"></h5>
                        <form class="card-body">
                            <h5 class="card-title">Особое обращение с заголовком</h5>
                            <p class="card-text">С вспомогательным текстом ниже в качестве естественного перехода к дополнительному контенту.</p>
                            <button type="submit" class="btn btn-primary mt-3">Next</button>
                        </form>
                    </div>
                </div>
                `
                APP.innerHTML = resultHtml;
                document.querySelector('.card-header').textContent = q.question;
                const answers = document.createElement('ul');
                answers.classList.add('answers', 'list-group');
                Object.keys(q.answers).forEach(key => {
                    if (!q.answers[key]) {
                        return;
                    }
                    if (isMmultiple) {
                        answers.append(this.addAnswerItem('checkbox', key, q.answers[key]));
                    } else {
                        answers.append(this.addAnswerItem('radio', key, q.answers[key]));
                    }
                })
                const form = document.querySelector('form');
                /** insert before button */
                document.querySelector('button[type="submit"]').before(answers)
                this.setRequired(form);
                form.addEventListener('change', this.setRequired.bind(this, form))
                form.addEventListener('submit', submitHandler);

                function submitHandler(event) {
                    event.preventDefault();
                    const answer = !isMmultiple 
                        ? event.target.elements.answer.value 
                        : [...event.target.elements.answer].filter(input => input.checked).map(input => input.value).join();
                    form.removeEventListener('submit', submitHandler);
                    form.removeEventListener('change', this.setRequired);
                    if (STATE.questions.length === STATE.currentStep) {
                        STATE.answers[STATE.currentStep] = new Answer(STATE.questions[STATE.currentStep - 1], answer);
                        resolve(STATE)
                    } else {
                        STATE.answers[STATE.currentStep] = new Answer(STATE.questions[STATE.currentStep - 1], answer);
                        nextStep()
                    }
                }
            }
            nextStep()
        })
    }
}

export default QuizStepCard;