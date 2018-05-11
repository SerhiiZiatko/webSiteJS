document.addEventListener('DOMContentLoaded', renderFirstPage);
window.addEventListener('unload', saveInLocalStorage);

function saveInLocalStorage() {
	localStorage.setItem('purchases', basket);
}

if(localStorage.getItem('purchases')) {
	var basket = localStorage.getItem('purchases').split(',');
	showBasketLabel();
} else {
	var basket = [];
}

const cardList = document.querySelector('.product-list');
cardList.addEventListener('click', addToBasket);

const formFilters = document.querySelector('.filters');
formFilters.addEventListener('click', makeRequest);

const sortBox = document.querySelector('.sorting');
sortBox.addEventListener('click', makeRequest);

const basketBtn = document.querySelector('.shopping-cart');
basketBtn.addEventListener('click', showBasket);

const goodsList = document.querySelector('.goods-list');
goodsList.addEventListener('click', deleteItemFromBasket);

const paginationList = document.querySelector('.pagination-list');
paginationList.addEventListener('click', showAnotherPage);

function renderFirstPage() {
	drawPaginationlist('');
	fetch("http://localhost:3000/phones?_page=1&_limit=6")
		.then(response => {
			if (response.status != 200) {
				alert('Error! Status: ' + response.status + ' message: ' + response.statusText);
				return;
			}
			response.json().then(response => render(response))
		})
		.catch(() => alert('Catch fetch'))

};

function createElements(tag, ...rest) {
	const element = document.createElement(tag);

	for (let i = 0; i < rest.length; i++) {
		element.classList.add(rest[i]);
	}

	return element;
}


function render(data) {
	for (let i = 0; i < data.length; i++) {
		renderElements(data[i])
	}
}

function renderElements(dataItem) {

	const fragment = document.createDocumentFragment();
	const item = createElements('li', 'product-item');
	item.setAttribute('data-id', dataItem.id);
	fragment.appendChild(item);

	const productImg = createElements('div', 'product-image');
	item.appendChild(productImg);

	const img = createElements('img');
	img.src = dataItem.img;
	productImg.appendChild(img);

	const productDescription = createElements('div', 'product-description');
	item.appendChild(productDescription);

	const title = createElements('h3', 'product-title');
	title.textContent = dataItem.name;
	productDescription.appendChild(title);

	const stars = createElements('div', 'stars');
	productDescription.appendChild(stars);

	const starsImg = createElements('span', 'stars-img');
	starsImg.innerHTML = dataItem.rating + '<i class="fas fa-star"></i>';
	stars.appendChild(starsImg);

	const price = createElements('span', 'price');
	price.textContent = `${dataItem.price}$`;
	productDescription.appendChild(price);

	const actionsBar = createElements('div', 'actions');
	productDescription.appendChild(actionsBar);

	const productBasket = createElements('span', 'product-basket-img', 'add-to-basket');
	productBasket.innerHTML = '<i class="fas fa-shopping-cart"></i> В корзину';
	actionsBar.appendChild(productBasket);
	cardList.appendChild(fragment);
}


function makeRequest(event, pageNumber = 1) {
	let queryString = makeQueryParams(event);

	drawPaginationlist(queryString);

	queryString += `&_page=${pageNumber}&_limit=6`;

	fetch(`http://localhost:3000/phones?${queryString}`)
		.then(response => {
			if (response.status != 200) {
				alert('Error! Status: ' + response.status + ' message: ' + response.statusText);
				return;
			}
			cardList.innerHTML = null;
			response.json().then(response => {
				render(response)
			})

		})
		.catch(() => alert('Catch fetch'))
}


function makeQueryParams(event) {

	//reviewing sorting state

	let queryList = [];
	let target = event.target;

	let activeSortParam = target.closest('[data-sort');
	let previousSortParam = sortBox.querySelector('.in-sorting');

	if (activeSortParam != null) {

		if (previousSortParam) {
			previousSortParam.classList.remove('in-sorting');
		}

		if (previousSortParam != activeSortParam) {
			activeSortParam.classList.add('in-sorting');
			queryList.push(activeSortParam.getAttribute('data-sort'));
		}

	}
	else if (previousSortParam) {
		queryList.push(previousSortParam.getAttribute('data-sort'));
	}

	//checking active filters

	if (target.tagName == 'LABEL') {
		event.preventDefault();
		let childCheckbox = target.querySelector('.filter-param');
		childCheckbox.checked = !childCheckbox.checked;
	}
	const filterParams = document.querySelectorAll('.filter-param');

	for (let i = 0; i < filterParams.length; i++) {
		if (!filterParams[i].checked) continue;
		let queryParam = 'brend=' + filterParams[i].getAttribute('data-type');
		queryList.push(queryParam);
	}

	let queryString = queryList.join('&');
	return queryString;
}


function addToBasket(event) {

	let target = event.target;
	let addBtn = target.closest('.add-to-basket');
	if (addBtn == null) return;
	const item = addBtn.closest('.product-item');
	if (item == null) return;
	const dataId = item.getAttribute('data-id');

	if (basket.indexOf(`id=${dataId}`) != -1) {
		alert('Товар уже в корзине');
		return
	}
	basket.push(`id=${dataId}`);
	showBasketLabel();
}

function showBasketLabel() {
	const basketItems = document.querySelector('.basket-items');
	const quantity = basketItems.querySelector('.quantity');

	if (basket.length != 0) {
		basketItems.classList.remove('hide');
		quantity.textContent = basket.length;
	}
}

function showBasket(event) {
	let target = event.target;
	if (!target.classList.contains('shopping-cart')) return;
	if (basket.length == 0) {
		alert('Корзина пуста');
		return;
	}
	let popupBasket = document.querySelector('.popup-basket');
	popupBasket.classList.remove('hide');

	const closeBasketImg = document.querySelector('.close-img');
	closeBasketImg.addEventListener('click', closeBasket);

	requestForBasket(basket);
	countTotalPrice()
}

function closeBasket() {
	goodsList.innerHTML = null;
	let popupBasket = document.querySelector('.popup-basket');
	popupBasket.classList.add('hide');
}

function requestForBasket(dataIdList) {
	let queryString = dataIdList.join('&');
	console.log(queryString);
	fetch(`http://localhost:3000/phones?${queryString}`)
		.then(response => {
			if (response.status != 200) {
				alert('Error! Status: ' + response.status + ' message: ' + response.statusText);
				return;
			}
			response.json().then(response => renderBasket(response))

		})
		.catch(() => alert('We have some problems'));
}

function renderBasket(data) {
	let totalPrice = 0;
	for (let i = 0; i < data.length; i++) {
		renderElementsInBasket(data[i]);
		totalPrice += data[i].price;
	}

	const priceBox = document.querySelector('.total-price');
	priceBox.textContent = `${totalPrice}$`;
}

function renderElementsInBasket(dataItem) {
	const fragment = document.createDocumentFragment();

	const item = createElements('li', 'goods-item');
	item.id = dataItem.id;
	fragment.appendChild(item);

	const itemImg = createElements('div', 'goods-item-img');
	item.appendChild(itemImg);

	const img = createElements('img', 'img-for-basket');
	img.src = dataItem.img;
	itemImg.appendChild(img);

	const itemName = createElements('div', 'goods-item-name');
	itemName.textContent = dataItem.name;
	item.appendChild(itemName);

	const itemPrice = createElements('div', 'goods-item-price');
	itemPrice.textContent = dataItem.price + '$';
	item.appendChild(itemPrice);

	const deleteItem = createElements('button', 'goods-delete');
	deleteItem.textContent = 'Delete';
	item.appendChild(deleteItem);

	goodsList.appendChild(fragment);
}

function deleteItemFromBasket(event) {

	let target = event.target;
	if(!target.classList.contains('goods-delete')) return;
	let item = target.closest('.goods-item');

	basket.splice(basket.indexOf(item), 1);
	item.remove();
	console.log(basket)
}

function countTotalPrice() {
	let query = basket.join('&');
	let totalPrice = 0;

	fetch(`http://localhost:3000/phones?${query}`)
		.then(response => {
			if (response.status != 200) {
				alert('Error! Status: ' + response.status + ' message: ' + response.statusText);
				return;
			}
			response.json().then(response => {
				response.forEach((item) => totalPrice += item.price);

			})

		})
		.catch(() => alert('We have some problems'));
	return totalPrice;
}


function drawPaginationlist(queryString) {
	paginationList.innerHTML = null;

	let totalCount = 0;

	fetch(`http://localhost:3000/phones?${queryString}`)
		.then(response => {
			if (response.status != 200) {
				alert('Error! Status: ' + response.status + ' message: ' + response.statusText);
				return;
			}
			response.json().then(response => {

				totalCount = response.length;

				let listItems = Math.ceil(totalCount / 6);

				for (let i = 0; i < listItems; i++) {

					let item = createElements('li', 'pagination-item');
					item.setAttribute('data-num-page', i + 1);
					item.textContent = i + 1;
					paginationList.appendChild(item);
				}
			})
		})
		.catch(() => alert('We have some problems'));
}

function showAnotherPage(event) {
	let target = event.target;
	if (target.tagName != 'LI') return;
	target.classList.add('active-page');
	makeRequest(event, target.getAttribute('data-num-page'));
}

