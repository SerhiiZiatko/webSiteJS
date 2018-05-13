let tempQuery = '';

async function getGoods(query = '', page = '', saveTemp = true) {
    let pagination = page ? `${query.length ? '&' : '?'}_page=${page}&_limit=8` : page;
    // Ждёт ответа от вызова fetch
    let url = 'http://localhost:3000/goods' + query + pagination;
    let response = await fetch(url);
    // Выполнится после resolved
    const data = await response.json();
    if (saveTemp) {
        tempQuery = query;
    }
    return response.status === 200 ? data : null;
}

class Pagination{
    constructor() {
        this.renderPagination(document.querySelector('.main'));
    }

    async renderPagination(root) {
        const count = Math.ceil((await getGoods(this.tempQuery, '', false)).length / 8);
        let pagination = `<ul class="pagination">`;
        for (let i = 1; i <= count; i++) {
            pagination += `<li><a data-number = '${i}' onclick = 'Pagination.prototype.handlePageLink(event)' class = 'page-link' href = '#'>${i}</a></li>`
        }
        pagination += `</ul>`;
        root.innerHTML += pagination;
    }

    async handlePageLink(e) {
        e.preventDefault();
        const pageNumber = e.target.dataset.number;
        console.log(pageNumber);
        ShopList.prototype.renderGoods(await getGoods(this.tempQuery, pageNumber, false));
    }
}

class ShopList{

    constructor(){
        this.filters = {
            maxPrice: 900,
            categories: []
        };
        this.renderGoods(getGoods('', 1));
        this.handleFilters();
    }

    async renderGoods(goods) {
        goods = await goods;
        let root = document.querySelector('.main');
        root.innerHTML = '';
        let list = document.createElement('ul');
        list.classList.add('list');
        root.appendChild(list);
        goods.forEach(item => {
            const good = `<li data-id = '${item.id}' class = 'good'>` +
                `<img src = '${item.image}' alt = 'good'>` +
                `<a href = '/webSiteJS/detailed.html?id=${item.id}'>${item.title}</a>` +
                `<span class = 'price'>${item.price}</span>` +
                `<button onclick = 'new Basket().addGoodToBasket(event)' class = 'button btn btn-danger'>Add to Basket</button>` +
                `</li>`;
            list.innerHTML += good;
        });
        new Pagination();
    }

    async handleFilters() {
        this.handleRange();
        this.handleCheckBox();
        const filterButton = document.querySelector('.filter-button');
        async function onFilter(e) {
            e.preventDefault();
            let query = `?price_lte=${this.filters.maxPrice}`;
            this.filters.categories.forEach(item => {
                query += `&category_ne=${item}`
            });
            let goods = await getGoods(query, 1);
            this.renderGoods(goods);
        }
        onFilter = onFilter.bind(this);
        filterButton.addEventListener('click', onFilter);
        // Cортировка на фронте
        /*
        let goods = await this.getGoods();
        let filterButton = document.querySelector('.filter-button');
        function onFilter(e){
            e.preventDefault();
            // Фильтруем по максимальной цене
            this.renderGoods(goods.filter(item => +item.price <= this.filters.maxPrice)
            // Фильтруем по категориям
                .filter(item => {
                    return this.filters.categories.indexOf(item.category) !== -1;
                } )
          )
        }
        onFilter = onFilter.bind(this);
        filterButton.addEventListener('click', onFilter);
        */
    }

    handleRange() {
        const rangeInput = document.querySelector('.range');
        rangeInput.addEventListener('input', (event) => {
            let label = event.target.parentElement.children[0];
            label.innerText = 'Max Price ' + rangeInput.value + '$';
            this.filters.maxPrice = rangeInput.value;
        });
    }

    handleCheckBox() {
        const checkboxes = document.querySelector('.checkboxes');

        function onClick(e) {
            if (e.target.type !== 'checkbox') {
                return false;
            }
            let category = e.target.dataset.id;
            if (this.filters.categories.indexOf(+category) === -1) {
                this.filters.categories.push(+category);
            } else {
                this.filters.categories = this.filters.categories.filter(item => +item !== +category);
            }
        }
        onClick = onClick.bind(this);
        checkboxes.addEventListener('click', onClick);
    }
}

class Basket{

    constructor() {
        this.renderBasketButton();
        this.renderBasket();
        this.handleCloseModal();
    }

    addGoodToBasket(e) {
        const itemId = e.target.parentElement.dataset.id;
        // Проверим, есть ли уже этот товар в корзине
        if (localStorage.getItem(`${itemId}`) !== null) {
            let value = +localStorage.getItem(`${itemId}`);
            console.log(itemId, value);
            localStorage.setItem(`${itemId}`, value + 1);
        } else {
            localStorage.setItem(`${itemId}`, 1);
        }
        this.renderBasketButton();
        this.handleCloseModal();
    }

    async renderBasket() {
        let tbody = document.querySelector('.basket-tbody');
        let totalPrice = 0;
        let totalCount = 0;
        tbody.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            const count = +localStorage.getItem(localStorage.key(i));
            const query = `?id=${localStorage.key(i)}`;
            const [good] = await getGoods(query, '', false);
            if (good) {
                this.renderBasketItem(good, count);
                totalPrice += count * good.price;
                totalCount += count;
            }
        }
        tbody.innerHTML += `<tr class = 'bg-danger'>
                                <th scope="row">Total</th>
                                <td>${totalCount}</td>
                                <td></td>
                                <td>${totalPrice}$</td>
                            </tr>`;
        this.handleCheckout();
    }

    renderBasketItem(good, count) {
        let tbody = document.querySelector('.basket-tbody');
        let item = `<tr>
                        <th scope="row">${good.title}</th>
                        <td>${count}</td>
                        <td>${good.price}$</td>
                        <td>${good.price * count}$</td>
                    </tr>`;
        tbody.innerHTML += item;
    }

    renderBasketButton() {
        let count = 0;
        for (let key in localStorage) {
            count += +localStorage.getItem(key)
        }
        let basketElement = document.querySelector('.basket-button');
        let basketButton = `<button type="button" class="btn btn-danger open-modal">` +
            `Basket <span class="badge badge-light">${count}</span>` +
            `</button>`;
        basketElement.innerHTML = basketButton;
    }

    handleCloseModal() {
        const buttonClose = document.querySelector('.close-modal');
        const buttonOpen = document.querySelector('.open-modal');

        function onClick() {
            let modal = document.querySelector('.modal');
            modal.classList.toggle('disabled');
            this.renderBasket();
        }
        onClick = onClick.bind(this);
        buttonClose.onclick = onClick;
        buttonOpen.onclick = onClick;
    }

    handleCheckout() {
        const checkoutButton = document.querySelector('.checkout-button');

        function onClick() {
            localStorage.clear();
            this.renderBasketButton();
        }
        onClick = onClick.bind(this);
        checkoutButton.addEventListener('click', onClick)
    }
    
}

new ShopList();
new Basket();