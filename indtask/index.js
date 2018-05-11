function onlineShop() {
    function createElement(tag, className) {
        let newElement = document.createElement(tag);
        newElement.className = className || '';
        return newElement;
    }

    let shop = document.querySelector('.shop');

    let filtersList = document.querySelector('.filters-list');

    let sort = document.querySelector('.sort');

    let basket = document.querySelector('.items-in-basket');

    let popup = document.querySelector('.popup-invisible');

    popup.querySelector('.close').addEventListener('click', closePopup);

    sort.addEventListener('click', sortShop);

    function renderCard(element, item) {
        let itemContainer = createElement('div', 'item-container');
        element.appendChild(itemContainer);

        let itemImageContainer = createElement('div', 'item-img-container');
        itemContainer.appendChild(itemImageContainer);

        let itemImage = createElement('img', 'item-img');
        itemImage.setAttribute('src', `https://openui5.hana.ondemand.com/${item.ProductPicUrl}`);
        itemImageContainer.appendChild(itemImage);

        let itemTitle = createElement('h3', 'item-title');
        itemTitle.innerText = item.Name;
        itemContainer.appendChild(itemTitle);

        let itemDescription = createElement('p', 'item-description');
        itemDescription.innerText = item.Description;
        itemContainer.appendChild(itemDescription);

        let itemFooter = createElement('div', 'item-footer');
        itemContainer.appendChild(itemFooter);

        let itemFooterPrice = createElement('span', 'price');
        itemFooterPrice.innerText = `${item.Price} ${item.CurrencyCode}`;
        itemFooter.appendChild(itemFooterPrice);

        let itemFooterBtn = createElement('div', 'btn');
        itemFooterBtn.dataset.id = item.ProductId;
        itemFooterBtn.classList.add('btn-buy');
        if (localStorage.getItem(item.ProductId)) {
            itemFooterBtn.innerText = 'FROM BASKET';
        } else {
            itemFooterBtn.innerText = 'TO BASKET';
        }
        itemFooterBtn.addEventListener('click', addToBasket);
        itemFooter.appendChild(itemFooterBtn);
    }

    fetch('http://localhost:3030/ProductCollectionStats')
        .then(response => {
            return response.json();
        })
        .then(stats => {
            let groups = Object.keys(stats.Groups.Category);

            for (let i=0; i<groups.length; i++) {
                let li = createElement('li', 'filters-list-item');
                let checkbox = createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                li.appendChild(checkbox);
                let filterText = document.createTextNode(groups[i]);
                li.insertBefore(filterText, null);
                filtersList.appendChild(li);
            }

            let submitBtn = createElement('button');
            submitBtn.innerText = 'Submit';



            filtersList.parentNode.appendChild(submitBtn);

            submitBtn.addEventListener('click', filterRender);
        })
        .catch(e => console.log(e));

    function switchRender(options, items) {
        switch (options) {
            case 'Ascending price':
                renderShop('http://localhost:3030/ProductCollection', 'Price', 'asc', ...items);
                break;
            case 'Descending price':
                renderShop('http://localhost:3030/ProductCollection', 'Price', 'desc', ...items);
                break;
            case 'Ascending quantity':
                renderShop('http://localhost:3030/ProductCollection', 'Quantity', 'asc', ...items);
                break;
            case 'Descending quantity':
                renderShop('http://localhost:3030/ProductCollection', 'Quantity', 'desc', ...items);
                break;
        }
    }

    function renderShop(url, sort, order, ...filters) {
        while (shop.childNodes.length > 2) {
            shop.removeChild(shop.lastChild);
        }

        let filtersStr = '';
        for (let i=0; i<filters.length; i++) {
            filtersStr += `Category=${filters[i]}&`;
        }
        fetch(`${url}?_sort=${sort}&_order=${order}&${filtersStr}`)
            .then(response => {
                return response.json();
            })
            .then(items => {
                let n = items.length > 9 ? 9 : items.length;
                for (let i = 0; i < n; i++) {
                    renderCard(shop, items[i]);
                }
                basket.innerText = allStorage().length;
            })
            .catch(e => console.error(e));
    }

    function sortShop(event) {
        while (shop.childNodes.length > 2) {
            shop.removeChild(shop.lastChild);
        }
        let filterItems = document.querySelector('.filters-list').children;
        let checkedItems = [];
        for (let i=1; i<filterItems.length; i++) {
            if (filterItems[i].firstChild.checked) {
                checkedItems.push(filterItems[i].lastChild.data.replace(/ /gi, '%20'));
            }
        }
        if(!event.target.classList.contains('chosen-sort-list-item')) {
            let sortOptions = event.target.closest('ul').children;
            for (let i=0; i<sortOptions.length; i++) {
                if (sortOptions[i].classList.contains('chosen-sort-list-item')) {
                    sortOptions[i].classList.remove('chosen-sort-list-item')
                }
            }
            event.target.classList.add('chosen-sort-list-item');

            let newSort = event.target.innerText;

            switchRender(newSort, checkedItems);
        }
    }

    function filterRender(event) {
        let filterItems = event.target.previousElementSibling.childNodes;
        let checkedItems = [];
        for (let i=1; i<filterItems.length; i++) {
            if (filterItems[i].firstChild.checked) {
                checkedItems.push(filterItems[i].lastChild.data.replace(/ /gi, '%20'));
            }
        }

        let newFilter = document.querySelector('.chosen-sort-list-item').innerText;

        switchRender(newFilter, checkedItems);
    }

    function addToBasket(event) {
        if (event.currentTarget.innerText == 'TO BASKET') {
            event.currentTarget.innerText = 'FROM BASKET';
            localStorage.setItem(event.currentTarget.dataset.id, 'id');
            basket.innerText = allStorage().length;
        } else {
            event.currentTarget.innerText = 'TO BASKET';
            localStorage.removeItem(event.currentTarget.dataset.id);
            basket.innerText = allStorage().length;
        }
    }

    function allStorage() {
        let storageKeys = Object.keys(localStorage);
        return storageKeys;
    }

    function renderBasket() {
        popup.classList.toggle('popup-visible');

        let ids = allStorage();
        if(ids.length) {
            while (popup.childNodes.length > 0) {
                popup.removeChild(popup.lastChild);
            }

            let filtersStr = '';
            for (let i=0; i<ids.length; i++) {
                filtersStr += `ProductId=${ids[i]}&`;
            }

            fetch(`http://localhost:3030/ProductCollection?${filtersStr}`)
                .then(response => {
                    return response.json();
                })
                .then(items => {
                    for (let i = 0; i < ids.length; i++) {
                        renderCard(popup, items[i]);
                    }
                    let popupButtons = popup.querySelectorAll('[data-id]');

                    for (let i=0; i < popupButtons.length; i++) {
                        popupButtons[i].addEventListener('click', basketRmItem);
                    }

                    let popupFooter = createElement('div', 'popup-footer');
                    popup.appendChild(popupFooter);

                    let clearAll = createElement('button', 'clear-all');
                    clearAll.innerText = 'Clear all';
                    clearAll.addEventListener('click', clearAllBasket);
                    popupFooter.appendChild(clearAll);

                    let buy = createElement('button', 'buy');
                    buy.innerText = 'BUY';
                    popupFooter.appendChild(buy);

                    let close = createElement('button', 'close');
                    close.innerText = 'Close';
                    close.addEventListener('click', closePopup);
                    popupFooter.appendChild(close);
                })
                .catch(e => console.error(e));
        }
    }

    function basketRmItem(event) {
        localStorage.removeItem(event.currentTarget.dataset.id);
        event.currentTarget.parentNode.parentNode.remove();
        document.querySelector(`[data-id=${event.currentTarget.dataset.id}]`).innerText = 'TO BASKET';
        if(!allStorage().length) {
            popup.innerText = 'Your basket is clear now. Chose items from the catalogue to add them here.';
        }

        let popupFooter = createElement('div', 'popup-footer');
        popup.appendChild(popupFooter);

        let close = createElement('button', 'close');
        close.innerText = 'Close';
        close.addEventListener('click', closePopup);
        popupFooter.appendChild(close);
    }

    function clearAllBasket() {
        localStorage.clear();
        basket.innerText = 0;

        popup.innerText = 'Your basket is clear now. Chose items from the catalogue to add them here.';

        let popupFooter = createElement('div', 'popup-footer');
        popup.appendChild(popupFooter);

        let close = createElement('button', 'close');
        close.innerText = 'Close';
        close.addEventListener('click', closePopup);
        popupFooter.appendChild(close);

        let buyButtons = shop.querySelectorAll('[data-id]');

        for (let i=0; i < buyButtons.length; i++) {
            buyButtons[i].innerText = 'TO BASKET';
        }
    }

    function closePopup() {
        popup.classList.remove('popup-visible')
    }

    let mainBasket = document.querySelector('.btn-basket');
    mainBasket.addEventListener('click', renderBasket);

    renderShop('http://localhost:3030/ProductCollection', 'Price', 'asc');
}

window.addEventListener("load", onlineShop);
