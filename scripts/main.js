import State from "./state.js";
import QuizApp from "./quiz.js";

export const state = new State();
new QuizApp(state);