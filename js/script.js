let basketArr = [];

window.addEventListener('load', () => {
        if(localStorage.getItem('basket')){
        let local = localStorage.getItem('basket').split(',');
        for (let i = 0; i < local.length; i++){
            basketArr.push(local[i] )
        }
        let updateBasket = new Basket();
        updateBasket.getBasket();
        }
});

class renderCard{
    constructor(info){
        this.container = document.querySelector('.products-block');
        this.img = info.img;
        this.brand = info.brand;
        this.popular = info.popular;
        this.price = info.price;
        this.model = info.model;
        this.id = info.id;

        this.pricePretty = this.prettyPrice(this.price);
        this.modal = document.querySelector('.modal');
    }
    render(){
        let item = document.createElement('li');
        item.id = this.id;
        item.classList.add('col-md-4', 'item');
        let imgSection = document.createElement('div');
        imgSection.classList.add('item-img');
        let img = document.createElement('img');
        img.setAttribute('src', this.img);
        imgSection.appendChild(img);
        item.appendChild(imgSection);
        let info = document.createElement('div');
        info.classList.add('d-flex', 'item-info', 'justify-content-center', 'flex-wrap');
        info.innerHTML = `<b class="brand"> ${this.brand[0].toUpperCase() + this.brand.slice(1) } </b> <span class="model"> ${this.model}</span>
        <div class="buy-block"><h4 class="price">${this.pricePretty}</h4><button class="buy-btn">Buy now</button></div>
        <div class="rating d-flex align-items-center"><span class="popularity">${this.popular}</span> <span><i class="fas fa-thumbs-up"></i></span></div>`;

        item.appendChild(info);
        this.container.appendChild(item);
        this.buyBtn = item.querySelector('.buy-btn');
        this.buyListener(this.buyBtn);

    }
    prettyPrice(price){
        let priceWithDot = (price/1000).toFixed(3).toString(),
            indexDot = priceWithDot.indexOf('.'),
            res = `${priceWithDot.slice(0, indexDot)} ${priceWithDot.slice(indexDot+1)}`;
        return `${res} uah`;
    }
    buyListener(btn) {
        btn.addEventListener('click', (e) => {
            this.productId = e.target.closest('.item').id;
            let basket = new Basket();
            basket.saveToBasket(this.productId);
            this.modal.classList.add('d-block');
        })
    }
}
class Pagination {
    constructor(){
        this.amountOnPage = document.querySelectorAll('.amount-products');
        this.paginationBlock = document.querySelector('.pagination');
        this.container = document.querySelector('.products-block');
        this.checkboxes = document.querySelectorAll('.filtersOnBrand input');

    }
    init(){
        for (let i = 0; i < this.amountOnPage.length; i++){
            this.amountOnPage[i].addEventListener('click', (e) =>{
                this.amountOnPage.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.checked = [];
                for( let i = 0; i < this.checkboxes.length; i++){
                    if(this.checkboxes[i].checked){
                        this.checked.push(this.checkboxes[i].id)
                    }
                }
                let initialization = new getStart();
                initialization.getRequestByFilter(this.checked);
            })
        }
    }
    render(response,amountOnPage) {
        this.removePagination();
        let pages = Math.ceil(response.length/amountOnPage);
        this.container.innerHTML = '';
        for (let i = 0; i < amountOnPage; i++){
            let newCard = new renderCard(response[i]);
            newCard.render();
        }

        for (let i = 0; i < pages; i++){
            let paginationBtn = document.createElement('li');
            paginationBtn.classList.add('page-item');
            paginationBtn.innerHTML = `${i+1}`;
            this.paginationBlock.appendChild(paginationBtn);
            paginationBtn.addEventListener('click', (e) => {
                this.container.innerHTML = '';
                let startProduct = (e.target.textContent * amountOnPage) - amountOnPage;
                let endProduct =  +amountOnPage + startProduct;
                for (let j = startProduct; j < endProduct; j++){
                    let newCard = new renderCard(response[j]);
                    newCard.render();
                }
            })
        }
    }
    removePagination(){
        this.paginstion = document.querySelectorAll('.page-item');
        if(this.paginstion){
            this.paginstion.forEach(btn => btn.remove())
        }
    }
}
let pagination = new Pagination();
pagination.init();
class getStart{
    constructor(){
        this.container = document.querySelector('.products-block');
        this.checkboxes = document.querySelectorAll('.filtersOnBrand input');
        this.popDown = document.querySelector('.popular-down');
        this.popUp = document.querySelector('.popular-up');
        this.priceDown = document.querySelector('.price-down');
        this.priceUp = document.querySelector('.price-up');
    }
    init(){
        this.request('http://localhost:3000/mobile');
        this.listenersOnMarkFilter();
        this.rating('http://localhost:3000/mobile?');
    }
    request(link){
        fetch(link)
            .then(response => {
                return response.json();
            })
            .then(response => {
                this.container.innerHTML = '';
                let activeAm = document.querySelector('.amount-products.active').getAttribute('data-amount');
                let pagination = new Pagination();

                if (response.length > activeAm){
                    pagination.render(response, activeAm);
                }else {
                    for (let i = 0 ; i < response.length; i++){
                        let newCard = new renderCard(response[i]);
                        pagination.removePagination();
                        newCard.render();
                    }

                }
            })
            .catch(alert);
    }
    listenersOnMarkFilter(){
        for( let i = 0; i < this.checkboxes.length; i++){
            this.checkboxes[i].addEventListener('change', () => {

                this.checked = [];
                for( let i = 0; i < this.checkboxes.length; i++){
                    if(this.checkboxes[i].checked){
                        this.checked.push(this.checkboxes[i].id)
                    }
                }
                this.getRequestByFilter(this.checked);
            })
        }
    }
    getRequestByFilter(brands){
        this.container.innerHTML = '';

        if(!brands.length){
            this.request('http://localhost:3000/mobile');
            this.rating('http://localhost:3000/mobile?');
        }else{
            let url = `http://localhost:3000/mobile?`;
            for(let i = 0; i < brands.length; i++){
                url += `brand=${brands[i]}&`
            }
            this.request(url.slice(0, -1));
            this.rating(`${url.slice(0, -1)}&`)
        }
    }
    rating(url){
        this.popUp.addEventListener('click', () => {
            this.container.innerHTML = '';
            this.request(`${url}_sort=popular&_order=asc`)
        });
        this.popDown.addEventListener('click', () => {
            this.container.innerHTML = '';
            this.request(`${url}_sort=popular&_order=desc`)
        });
        this.priceDown.addEventListener('click', () => {
            this.container.innerHTML = '';
            this.request(`${url}_sort=price&_order=desc`)
        });
        this.priceUp.addEventListener('click', () => {
            this.container.innerHTML = '';
            this.request(`${url}_sort=price&_order=asc`)
        })
    }
}
let initialization = new getStart();
initialization.init();

class Basket {
    constructor(){
        this.basketBtn = document.querySelector('.basket');
        this.modal = document.querySelector('.modal');
        this.closeBasket = document.querySelector('.to-store');
        this.productContainer = document.querySelector('.product-list');
        this.commonPrice = document.querySelector('.sum');
    }
    init(){
        this.basketBtn.addEventListener('click', () => {
            this.modal.classList.toggle('d-block');
            this.getBasket()
        });
        this.closeBasket.addEventListener('click', () => {
            this.modal.classList.remove('d-block')
        });
    }
    saveToBasket(id){
        if(basketArr.indexOf(id) == -1){
            basketArr.push(id);
            this.getBasket();
            localStorage.setItem('basket', basketArr);
        }
    }
    getBasket(){
        this.productContainer.innerHTML = '';
        if (!basketArr.length) {
            this.productContainer.innerHTML ='<h5>Your basket is empty</h5>';
            document.querySelector('.checkout').classList.add('d-none');
        }else{
            document.querySelector('.checkout').classList.remove('d-none');
            for (let i = 0; i < basketArr.length; i++){
                fetch(`http://localhost:3000/mobile?id=${basketArr[i]}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(res => {
                        this.renderBasket(res[0], i);
                        this.sum();
                    })
            }
        }
    }
    renderBasket(info, i){
        let product = document.createElement('li');
        product.setAttribute('data-queue', i);
        product.setAttribute('data-price', info.price);
        let prettyPrice = this.prettyPrice(info.price);
        product.classList.add('basket-item', 'd-flex', 'justify-content-between', 'align-items-center');
        product.innerHTML = `<span class="remove-product"><i class="fas fa-trash"></i></span><span class="fullModel">${info.brand} ${info.model}</span><div><span class="price">${prettyPrice}</span> <input class="order-amount" type="number" value="1"> </div> `

        this.productContainer.appendChild(product);
        this.removeProduct = product.querySelector('.remove-product');
        this.removeProduct.addEventListener('click', (e) => {
            let queue = e.target.closest('li').getAttribute('data-queue');

            basketArr.splice(queue, 1);
            e.target.closest('li').remove();
            this.sum();
            localStorage.setItem('basket', basketArr);

        });
        this.inputValue = product.querySelector('.order-amount');
        this.inputValue.addEventListener('change', () => {
            this.sum();
        })
    }

    prettyPrice(price){
        let priceWithDot = (price/1000).toFixed(3).toString(),
            indexDot = priceWithDot.indexOf('.'),
            res = `${priceWithDot.slice(0, indexDot)} ${priceWithDot.slice(indexDot+1)}`;
        return `${res} uah`;
    }
    sum(){
        let commonSum = 0;
        let children = this.productContainer.children;
        for (let i = 0; i < children.length; i++){
            if(children[i].hasAttribute('data-price')){
                let price = children[i].getAttribute('data-price');
                let amount = children[i].querySelector('.order-amount');
                commonSum += price*amount.value
            }
        }
        this.commonPrice.innerHTML = `${this.prettyPrice(commonSum)}`;
    }
}
let basket = new Basket();
basket.init();


