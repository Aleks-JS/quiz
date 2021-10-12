class CategoryListView {
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
                      <button href="#" class="btn btn-primary w-100" data-id="${category}">
                        <span>Select ${category}</span>
                      </button>
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
        const btnList = document.querySelectorAll('.btn');
        btnList.forEach(btn => {
            const categoryId = btn.getAttribute('data-id')
            btn.addEventListener('click', this.handleCategoriesBtnClick.bind(this, categoryId))
        })
    }
}

export default CategoryListView;