import {
    ROOT_DOM
} from "./variables.js";

class QuizStartCard {
    constructor(src, category, difficulty) {
        this.create(src, category, difficulty)
    }

    create(src, category, difficulty) {
        let resultHtml = `
        <div class="col-12">
            <div class="card">
                <div>
                    <img src="${src}" class="mx-auto d-block" alt="${category}" height="250"/>
                </div>
                <div class="card-body">
                    <div class="col-6 mx-auto">
                        <h5 class="card-title">${category}</h5>
                        <button class="btn btn-primary w-100" data-id="${category}">Go</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        ROOT_DOM.innerHTML = `
        <div class="container">
        <h3 class="mt-4 mb-4">You selected ${difficulty} difficulty in the ${category} category</h3>
          <div class="row">
            ${resultHtml}
          </div>
        </div>
        `
    }
}
export default QuizStartCard;