let database = [];
const basketArr = new Set();

class Filter {
  constructor() {
    this.container = document.querySelector('.app-container');
    this.form = document.querySelector('.filter');
    this.cl = ``;
  }
  render(r) {
    this.get();
    this.listener();
  }

  items(item) {
    const fragment = document.createDocumentFragment();
    const cell = document.createElement('div');
    const img = document.createElement('img');
    const name = document.createElement('p');
    const footer = document.createElement('div');
    const footerAdd = document.createElement('button');
    const footerPrice = document.createElement('p');

    cell.className = 'cell';
    footerAdd.type = 'button';
    footerAdd.className = "add-basket";
    footerAdd.dataset.id = item.id;
    footerAdd.innerText = 'add';

    cell.appendChild(img);
    cell.appendChild(name);
    footer.appendChild(footerAdd);
    footer.appendChild(footerPrice);
    cell.appendChild(footer);

    img.src = item.img;
    name.innerText = item.model
    footerPrice.innerText = item.price
    fragment.appendChild(cell);
    return fragment;
  }

  addItems(arr) {
    this.container.innerHTML = '';
    arr.forEach((item,i) => {
     this.container.appendChild(this.items(item,i)); 
    });
  }

  listener(arr) {
    const sort = document.querySelector('.sort');
    sort.addEventListener('click', (ev) => {
      if (ev.target.nodeName === "BUTTON") {
        const name = ev.target.name;
        const value = ev.target.value;
        function compareNumeric(a, b) {
          if (value === 'height') {
            return b[name] - a[name];
          }
          return a[name] - b[name];
        }
        database.sort(compareNumeric);
        this.addItems(database)
      } 
    })
    document.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('form__submit')) {
        const checked = this.form.querySelectorAll("input:checked");
        this.cl = '';
        checked.forEach((check) => {
          this.cl += `${check.name}=${check.value}&`
        })
        this.get();
      }
    })
  }

  get() {
    fetch(`http://localhost:3000/phone?${this.cl}`)
    .then((r) => {
      return r.json()
    })
    .then((json) => {
      this.addItems(json);
      database = json;
    })
    .catch((r) => {console.log('error')});
  }
}


// Тут конечно немного запутаная печаль, но работает)
class Basket {
  constructor() {
    this.getLocal = JSON.parse(localStorage.getItem('basket'));
    this.basket = document.querySelector('.basket');
    this.basketLength = document.querySelector('.basket__length');
    this.basketContainer = this.basket.querySelector('.basket__container');
    this.database = new Set();
    this.tempArr;
  }

  render() {
    this.listener();
    this.get();
    this.lengthsBasket();
  }

  listener() {
    document.addEventListener('click', (ev) => { 

      if (ev.target.classList.contains('add-basket')) {
        this.addToBasket(ev.target);
      } else if (ev.target.classList.contains('basket-button')) {
        this.basket.style.display = 'flex';
      } else if (ev.target.classList.contains('basket__close')) {
        this.basket.style.display = 'none';
      } else if (ev.target.classList.contains('basket__cell-remove')) {
        this.removeToBasket(event);
      }
    })
  }

  addToBasket(event) {
    let getLocal = JSON.parse(localStorage.getItem('basket'));
    if (getLocal == null) {
      this.database.add(event.dataset.id);
    } else {
      getLocal.forEach((item) => {
        this.database.add(item);
      })
      this.database.add(event.dataset.id);
    }
    localStorage.setItem('basket', JSON.stringify([...this.database]));
    this.get();
    this.lengthsBasket();
  }

  removeToBasket(event) {
    let len = JSON.parse(localStorage.getItem('basket'));
    len.forEach((item) => {
      this.database.add(item);
    })
    this.database.delete(event.target.dataset.id);
    localStorage.setItem('basket', JSON.stringify([...this.database]));
    this.get();
    this.lengthsBasket();
  }

  lengthsBasket() { 
    const len = JSON.parse(localStorage.getItem('basket'));
    if (len == undefined) {
      return this.basketLength.innerText = '';
    }
    if (len.length === 0) {
      return this.basketLength.innerText = '';
    }
    this.basketLength.innerText = len.length;
  }

  sumBasket() {
    const sum = document.querySelector('.basket__sum');
    const cell = document.querySelector('.basket__container');
    let su = 0;
    if (this.tempArr.length === 0) {
      sum.innerText = '';
    }
    this.tempArr.forEach((item) => {
      su += item.price;
    })
    sum.innerText = su;
  }

  addBasket(arr) {
    this.basketContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    arr.forEach((e,i) => {
      const cell = document.createElement('div');
      const cellRemove = document.createElement('button');
      const cellImg = document.createElement('img');
      const cellDesc = document.createElement('div');
      const cellTitle = document.createElement('p');
      const cellFixPrice = document.createElement('span');
      const cellNum = document.createElement('input'); 
      const cellAll = document.createElement('span');

      cell.className = 'basket__cell';
      cellRemove.innerText = 'remove';
      cellRemove.className = 'basket__cell-remove';
      cellRemove.dataset.id = e.id;
      cellImg.src = arr[i].img;
      cellImg.style.width = '110px';
      cellTitle.innerText = e.title;
      cellFixPrice.innerText = e.price;
      cellNum.type = 'number';
      cellNum.value = '1';
      cellNum.className = 'basket__quantity';
      cellAll.innerText = e.price;
      cellAll.dataset.price = e.price;
  
      cell.appendChild(cellRemove);
      cell.appendChild(cellImg);
      cellDesc.appendChild(cellTitle);
      cellDesc.appendChild(cellFixPrice);
      cell.appendChild(cellDesc);
      cell.appendChild(cellNum);
      cell.appendChild(cellAll);

      fragment.appendChild(cell)
    })  
    this.basketContainer.appendChild(fragment);
  }
  
  get() {
    const arr = JSON.parse(localStorage.getItem('basket'));
    if (arr == undefined || arr.length === 0) {
      this.tempArr = [];
      this.sumBasket();
      return this.basketContainer.innerHTML = '';
    }
    let jsonString = '';
    arr.forEach((item) => {
      jsonString += `id=${item}&`;
    })
    fetch(`http://localhost:3000/phone?${jsonString}`)
    .then((r) => r.json())
    .then((json) => {
      this.tempArr = json;
      this.sumBasket();
     return this.addBasket(json)
    })
    .catch((r) => console.log('error'));
  }
}

const filter = new Filter();
const basket = new Basket();

filter.render();

basket.render()
