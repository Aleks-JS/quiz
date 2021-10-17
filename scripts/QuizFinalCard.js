import {
    APP
} from "./variables.js";

class QuizFinalCard {
    constructor() {
    }

    addDetailInformationBlock() {
        /** accordion */
        const accordion = document.createElement('div');
        accordion.classList.add('accordion', 'mb-4');
        accordion.id = 'accordionPanel';
        /** accordion-item */
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');
        /** accordion-header */
        const accordionHeader = document.createElement('h2');
        accordionHeader.classList.add('accordion-header');
        accordionHeader.id = 'headingOne';
        /** accordion-button */
        const accordionButton = document.createElement('button');
        accordionButton.classList.add('accordion-button');
        accordionButton.dataset.bsToggle = 'collapse';
        accordionButton.dataset.bsTarget = '#panel-collapseOne';
        accordionButton.setAttribute('aria-expanded', 'false');
        accordionButton.setAttribute('aria-controls', 'panel-collapseOne');
        accordionButton.textContent = 'See detailed information';
        accordionHeader.append(accordionButton);
        /** accordion-collapse */
        const accordionCollapse = document.createElement('div');
        accordionCollapse.classList.add('accordion-collapse', 'collapse');
        accordionCollapse.id = 'panel-collapseOne';
        accordionCollapse.setAttribute('aria-labelledby', 'headingOne');
        /** accordion-body */
        const accordionBody = document.createElement('div');
        accordionBody.classList.add('accordion-body', 'text-start');
        accordionCollapse.append(accordionBody);
        accordionItem.append(accordionHeader);
        accordionItem.append(accordionCollapse);
        accordion.append(accordionItem);
        return accordion;
    }

    addGroup(id, question, state) {
        const answer = Object.values(state.answers).find(a => a.id === id);
        const card = document.createElement('div');
        card.classList.add('card', 'mb-1');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'lead');
        cardHeader.textContent = question;
        card.append(cardHeader);
        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush');
        ul.append(this.addLiElement('Your answer', answer.receivedAnswerValue, answer.isCorrect));
        ul.append(this.addLiElement('Correct answer', answer.correctAnswerValue, answer.isCorrect));
        card.append(ul);
        return card;
    }

    addLiElement(target, value, isCorrect) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        if (target === 'Your answer') {
            li.classList.add(isCorrect ? 'correct' : 'not-correct');
        }
        const s = document.createElement('strong');
        s.textContent = `${target}: `
        li.append(s);
        const span = document.createElement('span');
        span.textContent = value;
        li.append(span);
        return li;
    }

    async render(state) {
        let openedPanel = false;
        const correctAnswersCount = Object.values(state.answers).filter(answer => answer.isCorrect).length;
        return new Promise((resolve, reject) => {
            const resultHtml = `
            <div class="container">
                <h3 class="mt-4 mb-4 display-3">Quiz</h3>
                <div class="card final-card text-center">
                    <div class="card-header">Congratulations! The quiz is over!</div>
                    <div class="card-body">
                        <h5 class="card-title">You win)))</h5>
                        <button class="btn btn-primary">Go to start page</button>
                    </div>
                    <div class="card-footer text-muted">
                    2 дня спустя
                    </div>
                </div>
            </div>
        `
            APP.innerHTML = resultHtml;
           
            const title = document.querySelector('.card-title');
            title.textContent = correctAnswersCount === state.questions.length ?
                `You answered all ${correctAnswersCount} questions correctly!` :
                correctAnswersCount > 0 ?
                    `You answered ${correctAnswersCount} out of ${state.questions.length} questions correctly!` :
                    `Sorry, you didn't answer ${state.questions.length} questions correctly. Try again!`;
           
                if (correctAnswersCount !== state.questions.length) {
                    title.after(this.addDetailInformationBlock());
                    const body = document.querySelector('.accordion-body');
                    const btn = document.querySelector('.accordion-button');
                    btn.addEventListener('click', () => {
                        if (!openedPanel) {
                            state.questions.forEach(item => {
                                body.append(this.addGroup(item.id, item.question, state))
                            })
                        }
                        openedPanel = true;
                    })
                }
           
           
            document.querySelector('.final-card').querySelector('.btn-primary').addEventListener('click', clickHandler)

            function clickHandler(event) {
                resolve(true)
            }
        })
    }
}

export default QuizFinalCard;