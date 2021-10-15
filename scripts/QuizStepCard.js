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

    renderCard() {
        return new Promise((resolve, reject) => {
            const nextStep = () => {
                const {
                    STATE
                } = this;
                STATE.currentStep += 1;
                const q = STATE.questions[STATE.currentStep - 1];
                let resultHtml = `
                <div class="card">
                    <h5 class="card-header">${q.question}</h5>
                    <form class="card-body">
                        <h5 class="card-title">Особое обращение с заголовком</h5>
                        <p class="card-text">С вспомогательным текстом ниже в качестве естественного перехода к дополнительному контенту.</p>
                        <div class="answers"></div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
                `
                APP.innerHTML = resultHtml;
                let answersHtml = '';
                Object.keys(q.answers).forEach(key => {
                    if (!q.answers[key]) {
                        return;
                    }
                    if (q.multiple_correct_answers === 'true') {
                        answersHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${key}" id="${key}">
                    <label class="form-check-label" for="${key}">
                        ${q.answers[key]}
                    </label>
                </div>
                `
                    } else {
                        answersHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="answer" value="${key}" id="${key}">
                    <label class="form-check-label" for="${key}">
                    ${q.answers[key]}
                    </label>
                </div>
                `
                    }
                })

                document.querySelector('.answers').innerHTML = answersHtml;
                document.querySelector('form').addEventListener('submit', submitHandler);

                function submitHandler(event) {
                    event.preventDefault();
                    const answer = event.target.elements.answer.value;

                    document.querySelector('form').removeEventListener('submit', submitHandler)

                    if (STATE.questions.length === STATE.currentStep) {
                        resolve('comleted')
                    } else {
                        STATE.answers[STATE.currentStep] = new Answer(STATE.questions[STATE.currentStep], answer);
                        nextStep()
                    }
                }
            }
            nextStep()
        })
    }
}

export default QuizStepCard;