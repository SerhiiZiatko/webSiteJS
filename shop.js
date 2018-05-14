class List{
    constructor(parentEl, options) {
        this.parentEl = parentEl;

        this.options = options || {};

        this.data = options.arrOfItems || [];

        //this.createHeader(parentEl);

        this.list = document.createElement(this.options.parentElement);
        this.list.classList.add('img-block');
        parentEl.appendChild(this.list);
    }

    renderImgBlock(url) {
        let helpBlock = document.createElement('div');
        helpBlock.className = 'display-style';
        fetch(url)
            .then((resp)=>resp.json())
            .then((resp)=> {
                resp.forEach((item, index) => {
                    let elem = document.createElement(this.options.itemElement);
                    elem.classList.add('img-item');
                    let img = document.createElement('img');
                    img.setAttribute('src', item.img);
                    img.setAttribute('id', item.id);
                    img.className = 'img-it';
                    let textBlock = document.createElement('div');
                    textBlock.innerHTML = item.name + ' ' + item.price;
                    let buyBtn = document.createElement('button');
                    buyBtn.className = 'localBuy';
                    buyBtn.innerHTML = 'buy';
                    buyBtn.addEventListener('click', ()=>{
                        let buyObj = {};
                        buyObj.id = buyBtn.parentElement.parentElement.firstChild.id;
                        buyObj.price = parseInt(buyBtn.parentElement.firstChild.data.substr(-3, 2));
                        let buyInfoItem = document.getElementsByClassName('buy-name')[0];
                        if (buyInfoItem.innerHTML) {
                            buyInfoItem.innerHTML = buyInfoItem.innerHTML +',' + ' ' + buyObj.id;
                        } else {
                            buyInfoItem.innerHTML = 'Your buy item: ' + buyObj.id;
                        }
                        let buyInfoPrice = document.getElementsByClassName('buy-price')[0];
                        if (buyInfoPrice.innerHTML) {
                            buyObj.price = buyObj.price + parseInt(buyInfoPrice.innerHTML.slice(11, -1));
                        }
                        buyInfoPrice.innerHTML = 'Your price: ' + buyObj.price + '$';
                    })
                    textBlock.appendChild(buyBtn);
                    elem.appendChild(img);
                    elem.appendChild(textBlock);
                    helpBlock.appendChild(elem);
                    this.list.appendChild(helpBlock);
                })
            })
    }

    renderList() {
        this.list.classList.add('list-block');
        this.data.forEach((item, index) => {
            let elem = document.createElement(this.options.itemElement);
            elem.classList.add('item');
            elem.setAttribute('index', index);
            let check = document.createElement('input');
            check.classList.add('check');
            check.setAttribute('type', 'radio');
            check.setAttribute('name', 'button');
            check.addEventListener('click', ()=>{
                let preImgBlock = document.getElementsByClassName('display-style')[0];
                preImgBlock.className = 'none-img-block';
                let filterName = check.nextSibling.innerHTML;
                console.log(filterName);
                if (filterName.includes('price')) {
                    console.log('!');

                    let priceSum = filterName.substr(-3);
                    console.log(priceSum);
                    imgList.renderImgBlock(`http://localhost:3000/catalog?price=${priceSum}`);
                } else {
                    console.log('+')
                    imgList.renderImgBlock(`http://localhost:3000/catalog?name=${filterName}`);
                }


            })

            let span = document.createElement('span');
            span.classList.add('span');
            span.innerHTML = item;
            elem.appendChild(check);
            elem.appendChild(span);
            this.list.appendChild(elem);

        })
    }
}

const header = document.createElement('header');
header.classList.add('nav-bar');
const name = document.createElement('div');
name.classList.add('main-name');
header.appendChild(name);
const headerTitle = document.createElement('h1');
headerTitle.classList.add('title');
headerTitle.innerHTML = 'My Mobile';
name.appendChild(headerTitle);
const basketBlock = document.createElement('div');
basketBlock.className = 'flex-right';
const basketName = document.createElement('span');
basketName.innerHTML = 'basket';
const basket = document.createElement('div');
const buyNameItem = document.createElement('span');
buyNameItem.className = 'buy-name';
const buyPriceItem = document.createElement('span');
buyPriceItem.className = 'buy-price';
basket.appendChild(buyNameItem);
basket.appendChild(buyPriceItem);
basketBlock.appendChild(basketName);
basketBlock.appendChild(basket);

header.appendChild(basketBlock);
const main = document.createElement('main');
main.classList.add('main');
const filterBlock = document.createElement('div');
filterBlock.classList.add('filter-block');
main.appendChild(filterBlock);
document.body.appendChild(header);
document.body.appendChild(main);
const sort = document.createElement('div');
sort.className = 'sort-block';
const sortHeader = document.createElement('div');
sortHeader.className = 'sort-block-header';
const sortPrice = document.createElement('span');
sortPrice.innerHTML = 'Price';
const btnUp = document.createElement('button');
btnUp.innerHTML = 'Up';

btnUp.addEventListener('click', ()=>{
    console.log('sort');
    let preImgBlock = document.getElementsByClassName('display-style')[0];
    preImgBlock.className = 'none-img-block';

    if (document.querySelectorAll('input[type="radio"]:checked').length !== 0) {
        let checked = document.querySelectorAll('input[type="radio"]:checked')[0];
        console.log(checked);
        let filterName = checked.nextSibling.innerHTML;
        console.log(filterName);
        imgList.renderImgBlock(`http://localhost:3000/catalog?name=${filterName}&_sort=price,views&_order=asc`);
    } else {
        imgList.renderImgBlock("http://localhost:3000/catalog?_sort=price,views&_order=asc");
    }
})

const btnDown = document.createElement('button');
btnDown.innerHTML = 'Down';

btnDown.addEventListener('click', ()=>{
    console.log('sortDown');
    let preImgBlock = document.getElementsByClassName('display-style')[0];
    preImgBlock.className = 'none-img-block';

    if (document.querySelectorAll('input[type="radio"]:checked').length !== 0) {
        let checked = document.querySelectorAll('input[type="radio"]:checked')[0];
        console.log(checked);
        let filterName = checked.nextSibling.innerHTML;
        console.log(filterName);
        imgList.renderImgBlock(`http://localhost:3000/catalog?name=${filterName}&_sort=price,views&_order=desc`);
    } else {
        imgList.renderImgBlock("http://localhost:3000/catalog?_sort=price,views&_order=desc");
    }


    //imgList.renderImgBlock("http://localhost:3000/catalog?_sort=price,views&_order=desc");

})

const sortPopul = document.createElement('span');
sortPopul.innerHTML = 'Popular';
const btnUpPop = document.createElement('button');
btnUpPop.innerHTML = 'Up';

btnUpPop.addEventListener('click', ()=>{
    console.log('sort');
    let preImgBlock = document.getElementsByClassName('display-style')[0];
    preImgBlock.className = 'none-img-block';

    if (document.querySelectorAll('input[type="radio"]:checked').length !== 0) {
        let checked = document.querySelectorAll('input[type="radio"]:checked')[0];
        console.log(checked);
        let filterName = checked.nextSibling.innerHTML;
        console.log(filterName);
        imgList.renderImgBlock(`http://localhost:3000/catalog?name=${filterName}&_sort=rait,views&_order=asc`);
    } else {
        imgList.renderImgBlock("http://localhost:3000/catalog?_sort=rait,views&_order=asc");
    }

    //imgList.renderImgBlock("http://localhost:3000/catalog?_sort=rait,views&_order=asc");

})

const btnDownPop = document.createElement('button');
btnDownPop.innerHTML = 'Down';

btnDownPop.addEventListener('click', ()=>{
    console.log('sort');
    let preImgBlock = document.getElementsByClassName('display-style')[0];
    preImgBlock.className = 'none-img-block';

    if (document.querySelectorAll('input[type="radio"]:checked').length !== 0) {
        let checked = document.querySelectorAll('input[type="radio"]:checked')[0];
        console.log(checked);
        let filterName = checked.nextSibling.innerHTML;
        console.log(filterName);
        imgList.renderImgBlock(`http://localhost:3000/catalog?name=${filterName}&_sort=rait,views&_order=desc`);
    } else {
        imgList.renderImgBlock("http://localhost:3000/catalog?_sort=rait,views&_order=desc");
    }

    //imgList.renderImgBlock("http://localhost:3000/catalog?_sort=rait,views&_order=desc");

})

sortHeader.appendChild(sortPrice);
sortHeader.appendChild(btnUp);
sortHeader.appendChild(btnDown);
sortHeader.appendChild(sortPopul);
sortHeader.appendChild(btnUpPop);
sortHeader.appendChild(btnDownPop);
sort.appendChild(sortHeader);
main.appendChild(sort);

const list = new List(filterBlock, {
    parentElement: 'ul',
    itemElement: 'li',
    arrOfItems: ['samsung', 'meizu', 'lenovo', 'price: 10$', 'price: 20$', 'price: 30$'],
});
list.renderList();
const imgList = new List(sort, {
    parentElement: 'div',
    itemElement: 'div',
});
imgList.renderImgBlock("http://localhost:3000/catalog");


// fetch("http://localhost:3000/catalog", {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-type': 'application/json'
//     },
//     body: JSON.stringify({"img": "https://consumer-img.huawei.com/content/dam/huawei-cbg-site/common/mkt/list-image/phones/nova2/nova2-listimage-black.png", "name": "samsung", "price": "30$"})
// })
//     .then((resp)=> resp.json())
//     .then((resp)=> console.log(resp))

window.onload = () => {
    let buttonBuy = document.getElementsByClassName('localBuy');
    console.log (buttonBuy);
    for (let i = 0; i < buttonBuy.length; i++) {
        console.log (buttonBuy[i]);
        buttonBuy[i].addEventListener('click', ()=> {
            console.log('k');
            localStorage.setItem('id', JSON.stringify(buyObj.id));
            console.log()
        })
    }
}
