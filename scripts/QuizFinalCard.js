import {
    APP
} from "./variables.js";

class QuizFinalCard {
    constructor() {
        this.render();
    }

    render() {
        const resultHtml = `
        <div class="card text-center">
            <div class="card-header">Congratulations! The quiz is over!</div>
            <div class="card-body">
                <h5 class="card-title">Особое обращение с заголовком</h5>
                <p class="card-text">С вспомогательным текстом ниже в качестве естественного перехода к дополнительному контенту.</p>
                <a href="#" class="btn btn-primary">Go to start</a>
            </div>
            <div class="card-footer text-muted">
            2 дня спустя
            </div>
        </div>
        `
        APP.innerHTML = resultHtml;
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }
}

export default QuizFinalCard;