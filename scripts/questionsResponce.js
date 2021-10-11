class Answers {
    answer_a = null
    answer_b = null
    answer_c = null
    answer_d = null
    answer_e = null
    answer_f = null
}

class CorrectAnswers {
    answer_a_correct = null
    answer_b_correct = null
    answer_c_correct = null
    answer_d_correct = null
    answer_e_correct = null
    answer_f_correct = null
}

class Question {
    id = null;
    question = null;
    description = null;
    answers = new Answers();
    multiple_correct_answers = null;
    correct_answers = new CorrectAnswers();
    correct_answer = null;
    explanation = null;
    tip = null;
    tags = [{
        name: null
    }];
    category = null;
    difficulty = null;

    constructor(responce) {
        Object.assign(this, responce)
    }
}

class QuestionsResponce extends Array {
    constructor(questionsResponce) {
        super();
        Object.assign(this, questionsResponce.map(res => new Question(res)))
    }
}

export default QuestionsResponce;