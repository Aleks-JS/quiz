import {
    APP
} from "./variables.js";
class QuizStepCard {
    constructor(state) {
        this.STATE = state;
        this.renderCard()
    }

    nextStep() {
        this.STATE.currentStep += 1;
        console.log(this.STATE);
        this.renderCard();
    }

    renderCard() {
        const {
            STATE
        } = this;
        const q = STATE.questions[STATE.currentStep];
        console.log(STATE.questions[STATE.currentStep]);
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
        document.querySelector('form').addEventListener('submit', (event) => {
            event.preventDefault();
            console.log(event.target.answer);
            console.log(this);
        })
    }
}

export default QuizStepCard;