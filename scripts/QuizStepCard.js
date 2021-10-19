import {APP} from "./variables.js";
import Answer from "./Answer.js";

class QuizStepCard {
	constructor(state) {
		this.STATE = state;
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

	renderTemplate() {
		const {
			STATE
		} = this;
		const q = STATE.questions[STATE.currentStep - 1];
		const isMultiple = q.multiple_correct_answers === 'true';
		APP.innerHTML = `
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
                `;
		document.querySelector('.card-header').textContent = `Question ${STATE.currentStep} of ${STATE.questions.length}`;
		document.querySelector('.card-title').textContent = q.question;
		document.querySelector('.card-text').textContent = isMultiple ? 'Choose one or more answer options' : 'Choose one answer';
		const answers = document.createElement('ul');
		answers.classList.add('answers', 'list-group');
		Object.keys(q.answers).forEach(key => {
			if (!q.answers[key]) {
				return;
			}
			if (isMultiple) {
				answers.append(this.addAnswerItem('checkbox', key, q.answers[key]));
			} else {
				answers.append(this.addAnswerItem('radio', key, q.answers[key]));
			}
		});
		/** insert before button */
		document.querySelector('button[type="submit"]').before(answers);
		if (STATE.currentStep > 1) {
			const prevStepBtn = document.createElement('button');
			prevStepBtn.type = 'button';
			prevStepBtn.classList.add('btn', 'btn-secondary', 'mt-3', 'me-3');
			prevStepBtn.textContent = 'Previous';
			document.querySelector('button[type="submit"]').before(prevStepBtn);
		}
	}

	async renderCard() {
		return new Promise((resolve, reject) => {
			const nextStep = async (next = true) => {
				const {
					STATE
				} = this;
				STATE.currentStep = next ? STATE.currentStep += 1 : STATE.currentStep -= 1;
				const q = STATE.questions[STATE.currentStep - 1];
				const isMultiple = q.multiple_correct_answers === 'true';
				await this.renderTemplate();
				const form = document.querySelector('form');
				if (STATE.answers[STATE.currentStep] && STATE.answers[STATE.currentStep].receivedAnswer) {
					if (isMultiple) {
						const inputs = [...form.elements.answer];
						const answers = STATE.answers[STATE.currentStep].receivedAnswer.split(',');
						inputs.filter(input => answers.includes(input.id)).forEach(input => input.checked = true);

					} else {
						form.elements.answer.value = STATE.answers[STATE.currentStep].receivedAnswer;
					}
				}
				this.setRequired(form);
				form.addEventListener('change', this.setRequired.bind(this, form))
				form.addEventListener('submit', submitHandler);
				const prevBtn = STATE.currentStep > 1 ? document.querySelector('button[type="button"]') : null;

				if (prevBtn) {
					prevBtn.addEventListener('click', takeStepBack)
				}

				function submitHandler(event) {
					event.preventDefault();
					const answer = !isMultiple
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

				function takeStepBack() {
					nextStep(false);
				}
			}
			nextStep()
		})
	}
}

export default QuizStepCard;