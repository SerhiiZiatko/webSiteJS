class Shop {
    constructor() {
        this.itemContainer = document.getElementById('items');
        const descriptionPoints = ['Title: ', 'Color: ', 'Size: ', 'Style: ', 'Price: ', 'Popular: '];
        const descriptionPointsSpan = ['title', 'color', 'size', 'style', 'price', 'popular'];
        const URL = 'http://localhost:3000/models';
        let forSort = {
            'priceUp': '?_sort=price&_order=asc',
            'priceDown': '?_sort=price&_order=desc',
            'popUp': '?_sort=popular&_order=asc',
            'popDown': '?_sort=popular&_order=desc',
        };
        let filterButton = document.getElementById('filter');
        filterButton.addEventListener('click', this.filter.bind(this, URL, descriptionPoints, descriptionPointsSpan, this.itemContainer));
        let sortBlock = document.getElementById('sort-block');
        sortBlock.addEventListener('click', this.sort.bind(this, URL, forSort, descriptionPoints, descriptionPointsSpan, this.itemContainer));
        this.allItemsRender(URL, descriptionPoints, descriptionPointsSpan, this.itemContainer);
    }
    static render(data, descriptionPoints, descriptionPointsSpan, container) {
        for (let i = 0; i < data.length; i++) {
            let item = Shop.createElem('div', 'item');
            let imgWrap = Shop.createElem('div', 'img-wrap');
            let img = Shop.createElem('img', 'img');
            img.setAttribute('src', data[i].img);
            img.setAttribute('alt', data[i].title);
            let descriptionList = Shop.createElem('ul', 'description');
            for (let j = 0; j < descriptionPoints.length; j++) {
                let li = Shop.createElem('li', 'description-list');
                li.innerText = descriptionPoints[j];
                let attr = descriptionPointsSpan[j];
                let span = Shop.createElem('span', attr);
                span.innerText = data[i][attr];
                li.appendChild(span);
                descriptionList.appendChild(li);
            }
            imgWrap.appendChild(img);
            item.appendChild(imgWrap);
            item.appendChild(descriptionList);
            container.appendChild(item);
        }
    }
    allItemsRender(URL, descriptionPoints, descriptionPointsSpan, container) {
        fetch(URL)
            .then((response) => response.json())
            .then(responseJSON => {
                Shop.render(responseJSON, descriptionPoints, descriptionPointsSpan, container)
                }
            )
    }
    sort(URL, data, descriptionPoints, descriptionPointsSpan, container, e) {
        let target = e.target;
        let sortLine = data[target.id];
        fetch(URL+sortLine)
            .then((response) => response.json())
            .then(responseJSON => {
                this.itemContainer.innerHTML = '';
                Shop.render(responseJSON, descriptionPoints, descriptionPointsSpan, container)
            })
    }
    filter(URL, descriptionPoints, descriptionPointsSpan, container) {
        let checkedList = [[].slice.call(document.querySelectorAll('input[name=color]:checked')), [].slice.call(document.querySelectorAll('input[name=size]:checked')), [].slice.call(document.querySelectorAll('input[name=style]:checked'))];
        let attr = ['color', 'size', 'style'];
        let str = '?';
        let string = this.madeQueryString(checkedList, str, attr);
        let query = string.slice(0, string.length-1);
        fetch(URL+query)
            .then((response) => response.json())
            .then(responseJSON => {
                this.itemContainer.innerHTML = '';
                let inputs = [].slice.call(document.querySelectorAll('input[type=checkbox]:checked'));
                for(let c = 0; c < inputs.length; c++) {
                    inputs[c].checked = false;
                }
                Shop.render(responseJSON, descriptionPoints, descriptionPointsSpan, container)
            })
    }
    static createElem(elem, clas) {
        let element = document.createElement(elem);
        element.classList.add(clas);
        return element;
    }
    madeQueryString(checkedList, str, attr) {
            for(let z = 0; z < checkedList.length; z++) {
                let elem = checkedList[z];
                for(let k = 0; k < elem.length; k++) {
                    str += `${attr[z]}=${elem[k].id}&`;
                }
            }
            return str;
        };
}
let shop = new Shop();