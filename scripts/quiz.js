import QuestionsResponce from "./questionsResponce.js";
import ModalSetDifficulty from "./modalSetDifficulty.js";

class QuizApp {

    API_KEY = 'ajsXJPL5M618y9wJ4dYFaa90yh40ikLIt7MHd0ak'
    request_options = {
        headers: {
            'x-api-key': this.API_KEY
        }
    }
    JSON_ROOT = './json'
    ROOT_DOM = document.querySelector('#app');
    QUIZ_API_URL = 'https://quizapi.io/api/v1';
    QUIZ_MAP = new Map();
    QUIZ_STATE;
    DIFFICULTY_LIST = [];
    CACHED_IMAGES = [];

    constructor(state) {
        this.QUIZ_STATE = state;
        // получаем список категорий с путями к картинкам
        this.fetchImages()
            .then(this.renderCategories.bind(this))
            .catch(console.log)

        this.fetchQuestions()
            .then(data => {
                console.log(data);
            }).catch(console.log)
    }

    async fetchImages() {
        try {
            const responce = await fetch(`${this.JSON_ROOT}/images.json`);
            const data = await responce.json();
            this.CACHED_IMAGES = data;
            return data;
        } catch (err) {
            console.log(err.message);
        }
    }

    async fetchQuestions() {
        try {
            const responce = await fetch(`${this.QUIZ_API_URL}/questions`, this.request_options)
            const data = await responce.json();
            return new QuestionsResponce(data);
        } catch (err) {
            console.log(err.message);
        }
    }

    async fetchQuizById(category) {
        try {
            this.QUIZ_STATE.category = category;
            const {
                QUIZ_MAP,
                QUIZ_API_URL
            } = this;
            if (QUIZ_MAP.has(category)) {
                this.DIFFICULTY_LIST = [...QUIZ_MAP.get(category)].filter((q, i, arr) => {
                    return i === arr.findIndex(_q => _q.difficulty === q.difficulty)
                }).map(_q => _q.difficulty)
                return new ModalSetDifficulty(this.DIFFICULTY_LIST).createModal();
            } else {
                let params;
                switch (category) {
                    case 'javaScript':
                        params = new URLSearchParams({
                            category: 'code',
                            tags: category
                        })
                        break;
                    default:
                        params = new URLSearchParams({
                            category
                        })
                }
                const responce = await fetch(`${QUIZ_API_URL}/questions?${params}`, this.request_options)
                const data = await responce.json()
                this.DIFFICULTY_LIST = data.filter((q, i, arr) => {
                    return i === arr.findIndex(_q => _q.difficulty === q.difficulty)
                }).map(_q => _q.difficulty)
                QUIZ_MAP.set(category, new QuestionsResponce(data))
                return new ModalSetDifficulty(this.DIFFICULTY_LIST).createModal();
            }

        } catch (err) {
            console.log(err.message);
        }
    }

    renderDifficultis(difficulty) {
        this.QUIZ_STATE.questions = [...this.QUIZ_MAP.get(this.QUIZ_STATE.category)].filter(_q => _q.difficulty === difficulty)
        const src = this.CACHED_IMAGES.find(c => c.category === this.QUIZ_STATE.category).src
        let resultHtml = `
        <div class="col-12">
            <div class="card" style="width: 18rem">
            <img src="${src}" class="card-img-top" alt="${this.QUIZ_STATE.category}" height="250"/>
            <div class="card-body">
                <h5 class="card-title">${this.QUIZ_STATE.category}</h5>
                <button href="#" class="btn btn-primary w-100" data-id="${this.QUIZ_STATE.category}">Go</button>
            </div>
            </div>
        </div>
        `;
        this.ROOT_DOM.innerHTML = `
        <div class="container">
        <h3 class="mt-4 mb-4">You selected ${difficulty} difficulty in the ${this.QUIZ_STATE.category} category</h3>
          <div class="row">
            ${resultHtml}
          </div>
        </div>
        `
    }

    renderCategories(data) {
        let resultHtml = '';
        data.forEach(({
            src,
            category
        }) => {
            resultHtml += `
                <div class="col-md-3">
                  <div class="card" style="width: 18rem">
                    <img src="${src}" class="card-img-top" alt="${category}" height="250"/>
                    <div class="card-body">
                      <h5 class="card-title">${category}</h5>
                      <button href="#" class="btn btn-primary w-100" data-id="${category}">Go</button>
                    </div>
                  </div>
                </div>
            `
        });
        this.ROOT_DOM.innerHTML = `
        <div class="container">
        <h3 class="mt-4 mb-4">Please, choose category</h3>
          <div class="row">
            ${resultHtml}
          </div>
        </div>
        `
        this.bindCategoriesClick();
    }

    bindCategoriesClick() {
        const btnList = document.querySelectorAll('.btn');
        btnList.forEach(btn => {
            const categoryId = btn.getAttribute('data-id')
            btn.addEventListener('click', this.handleCategoriesBtnClick.bind(this, categoryId))
        })
    }

    handleCategoriesBtnClick(categoryId) {
        this.QUIZ_STATE.categoryId = categoryId;
        this.fetchQuizById(categoryId)
            .then(
                data => {
                    if (data) {
                        this.QUIZ_STATE.difficulty = data;
                        this.renderDifficultis(data);
                    }
                }).catch(err => {
                if (err) {
                    console.log(err.message);
                }
            })
    }
}

export default QuizApp;