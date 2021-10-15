import {
    APP
} from "./variables.js";

class QuizStartCard {
    // constructor(src, category, difficulty) {
    //     this.create(src, category, difficulty)
    // }

    render(src, category, difficulty) {
        return new Promise((resolve) => {
            let resultHtml = `
            <div class="col-12 start-card">
                <div class="card">
                    <div>
                        <img src="${src}" class="mx-auto d-block" alt="${category}" height="250"/>
                    </div>
                    <div class="card-body">
                        <div class="col-6 mx-auto">
                            <h5 class="card-title">${category}</h5>
                            <button class="btn btn-primary w-100" data-id="start">Go</button>
                        </div>
                        <div class="col-6 mx-auto mt-2">
                            <button class="btn btn-outline-primary w-100" data-id="back">Return to category selection</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            APP.innerHTML = `
            <div class="container">
            <h3 class="mt-4 mb-4">You selected ${difficulty} difficulty in the ${category} category</h3>
            <div class="row">
                ${resultHtml}
            </div>
            </div>
            `
            const btns = document.querySelector('.start-card').querySelectorAll('button');

            btns.forEach(btn => {
                btn.addEventListener('click', clickHandler)
            });

            function clickHandler(e) {
                btns.forEach(btn => btn.removeEventListener('click', clickHandler))
                if (e.target.dataset.id === 'start') {
                    resolve(category)
                } else {
                    resolve('back')
                }
            }
        })
    }
}
export default QuizStartCard;