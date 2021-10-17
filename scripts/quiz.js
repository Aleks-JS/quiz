import QuestionsResponce from "./questionsResponce.js";
import ModalSetDifficulty from "./modalSetDifficulty.js";
import ButtonSpinner from "./ButtonSpinner.js";
import CategoryListView from "./CategoryListView.js";
import {
    API_KEY,
    JSON_ROOT,
    QUIZ_API_URL
} from "./variables.js";
import QuizStartCard from "./QuizStartCard.js";
import QuizStepCard from "./QuizStepCard.js";
import QuizFinalCard from "./QuizFinalCard.js";

class QuizApp {

    request_options = {
        headers: {
            'x-api-key': API_KEY
        }
    }
    QUIZ_MAP = new Map();
    QUIZ_STATE;
    DIFFICULTY_LIST = [];
    CACHED_IMAGES = [];

    constructor(state) {
        this.QUIZ_STATE = state;
        // получаем список категорий с путями к картинкам
        this.renderCategoriesList();
    }

    renderCategoriesList() {
        this.fetchImages()
            .then(new CategoryListView().renderCategories.bind(this))
            .then(btnList => {
                btnList.forEach(btn => {
                    const category = btn.getAttribute('data-id')
                    btn.addEventListener('click', () => this.handleCategoriesBtnClick(category))
                })
            })
            .catch(console.log)
    }

    async fetchImages() {
        try {
            if (!this.CACHED_IMAGES.length) {
                const responce = await fetch(`${JSON_ROOT}/images.json`);
                const data = await responce.json();
                this.CACHED_IMAGES = data;
                return data;
            } else {
                return this.CACHED_IMAGES;
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    async fetchQuestions() {
        try {
            const responce = await fetch(`${QUIZ_API_URL}/questions`, this.request_options)
            const data = await responce.json();
            return new QuestionsResponce(data);
        } catch (err) {
            console.error(err.message);
        }
    }

    async fetchQuizById(category) {
        new ButtonSpinner(`[data-id=${category}] span`).add();
        try {
            this.QUIZ_STATE.category = category;
            const {
                QUIZ_MAP
            } = this;
            if (QUIZ_MAP.has(category)) {
                new ButtonSpinner(`[data-id=${this.QUIZ_STATE.category}] span`).remove();
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
                    .finally(() => new ButtonSpinner(`[data-id=${this.QUIZ_STATE.category}] span`).remove())
                const data = await responce.json()
                this.DIFFICULTY_LIST = data.filter((q, i, arr) => {
                    return i === arr.findIndex(_q => _q.difficulty === q.difficulty)
                }).map(_q => _q.difficulty)
                QUIZ_MAP.set(category, new QuestionsResponce(data))
                return new ModalSetDifficulty(this.DIFFICULTY_LIST).createModal();
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    handleCategoriesBtnClick(category) {
        this.fetchQuizById(category)
            .then(
                data => {
                    if (data) {
                        this.QUIZ_STATE.difficulty = data;
                        this.QUIZ_STATE.questions = this.QUIZ_MAP.get(category);
                        return this.renderQuiz(data);
                    }
                }).catch(err => {
                if (err) {
                    console.error(err.message);
                }
            })
    }

    async renderQuiz(difficulty) {
        this.QUIZ_STATE.questions = [...this.QUIZ_MAP.get(this.QUIZ_STATE.category)].filter(_q => _q.difficulty === difficulty)
        const src = this.CACHED_IMAGES.find(c => c.category === this.QUIZ_STATE.category).src
        // const renderStart = await new QuizStartCard().render(src, this.QUIZ_STATE.category, difficulty);
        // const nextStepData = renderStart === 'back' ?
        //     this.renderCategoriesList() :
        //     await new QuizStepCard(this.QUIZ_STATE).renderCard();
        // if (nextStepData) {
        //     return new QuizFinalCard().render(nextStepData);
        // }
        // return nextStepData;

        new QuizStartCard().render(src, this.QUIZ_STATE.category, difficulty)
            .then(data => {
                if (data === 'back') {
                    this.renderCategoriesList()
                } else {
                    return new QuizStepCard(this.QUIZ_STATE).renderCard()
                }
            })
            .then(state => {
                return new QuizFinalCard().render(state);
            })
            .then(data => {
                if (data) {
                    this.QUIZ_STATE.init();
                    this.renderCategoriesList()
                }
                console.log(data);
            }).catch(error => console.warn(error.message))
    }
}

export default QuizApp;