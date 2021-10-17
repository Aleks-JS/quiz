import {
    APP
} from "./variables.js";

class CategoryListView {
    renderCategories(data) {
        return new Promise((resolve, reject) => {
            let resultHtml = '';
            data.forEach(({
                src,
                category
            }) => {
                resultHtml += `
                <div class="col">
                    <div class="card m-auto" style="width: 18rem">
                        <div class="p-3">
                            <img src="${src}" class="mx-auto d-block card-img-top" alt="${category}" height="250"/>
                        </div>
                        <div class="card-body">
                        <h5 class="card-title">${category}</h5>
                        <button class="btn btn-primary w-100" data-id="${category}">
                            <span>Select ${category}</span>
                        </button>
                        </div>
                    </div>
                </div>    
                `
            });
            APP.innerHTML = `
            <div class="container">
            <h3 class="mt-4 mb-4 display-3">Welcome to the quiz!</h3>
            <div class="card-header">Please, choose category</div>
            <div class="row py-5">
                ${resultHtml}
            </div>
            </div>
            `
            const btnList = document.querySelectorAll('.btn');
            resolve(btnList)
        })
    }
}

export default CategoryListView;