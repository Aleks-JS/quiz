const BODY_ROOT = document.querySelector('body');
const MODAL = document.createElement('div');


class ModalSetDifficulty {
    difficulty = null;
    constructor(difficultyList = []) {
        this.difficultyList = difficultyList;
    }

    createModal() {
        return new Promise((resolve, reject) => {
            /** Add modal */
            MODAL.setAttribute('tabindex', '-1');
            MODAL.setAttribute('aria-labelledby', 'difficultyModalLabel');
            MODAL.id = 'difficultyModal';
            MODAL.classList.add('modal');
            MODAL.classList.add('fade');
            MODAL.dataset.bsBackdrop = 'static';
            let resultHtml = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="difficultyModalLabel">Choose difficulty</h5>
                        </div>
                        <div class="modal-body">
                            <p>Modal body text goes here.</p>
                            <select class="form-select form-select-sm mb-3" aria-label=".form-select-sm">
                                <option selected>Open this select menu</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="closed">Close</button>
                            <button type="button" class="btn btn-primary" id="changed">Save changes</button>
                        </div>
                    </div>
                </div>
        `;
            MODAL.innerHTML = resultHtml;
            BODY_ROOT.append(MODAL);
            const modal = new bootstrap.Modal(document.getElementById('difficultyModal'), {
                keyboard: false
            })
            /** Open modal */
            modal.toggle()
            /** Set select options */
            const select = document.querySelector('.form-select');
            this.difficultyList.forEach((item, i) => {
                const option = document.createElement('option');
                option.setAttribute('value', i);
                option.textContent = item;
                select.append(option);
            })
            select.addEventListener('change', this.changed.bind(this, select));
            /** Handler click button */
            document.querySelector('.modal-footer').querySelectorAll('button').forEach(btn => btn.addEventListener('click', event => {
                this.closeModal(modal)
                if (event.target.id === 'changed') {
                    resolve(this.difficulty)
                } else {
                    reject(this.difficulty)
                }
            }))
        })
    }

    closeModal(modal) {
        modal.hide();
        MODAL.remove();
    }

    changed(select) {
        this.difficulty = this.difficultyList[select.value] ? this.difficultyList[select.value] : null;
    }
}

export default ModalSetDifficulty;