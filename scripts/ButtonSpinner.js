class ButtonSpinner {
    classes = ['spinner-border', 'spinner-border-sm']
    constructor(selector) {
        this.selector = selector;
    }
    add() {
        const spinner = document.createElement('span');
        spinner.classList.add(...this.classes);
        spinner.setAttribute('role', 'status');
        spinner.setAttribute('aria-hidden', 'true');
        spinner.style.marginLeft = '5px';
        document.querySelector(this.selector).append(spinner)
    }
    remove() {
        document.querySelector(this.selector).querySelector('span').remove();
    }
}

export default ButtonSpinner;