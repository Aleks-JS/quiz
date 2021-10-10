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
    QUIZ_STATE = {
        category: null,
        questions: [],
        completed: 0,
        count: 0,
        currentIdx: 0
    }

    constructor() {
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
            return data;
        } catch (err) {
            console.log(err.message);
        }
    }

    async fetchQuestions() {
        try {
            const responce = await fetch(`${this.QUIZ_API_URL}/questions`, this.request_options)
            const data = await responce.json();
            return data;
        } catch (err) {
            console.log(err.message);
        }
    }

    async fetchQuizById(category) {
        try {
            const {
                QUIZ_MAP,
                QUIZ_API_URL
            } = this;
            if (QUIZ_MAP.has(category)) {
                return QUIZ_MAP.get(category)
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
                console.log(data);
                return data
            }

        } catch (err) {
            console.log(err.message);
        }
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
    }
}

export default QuizApp;