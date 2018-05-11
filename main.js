let allFilter = document.querySelector('.filters');
allFilter.addEventListener('click', doRequest);//filter
let sorting = document.querySelector('.sorting');//sortingElements
sorting.addEventListener('click', doRequest);





fetch('http://localhost:3000/phones')
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        addPhones(response);
    })
    .catch(() =>  alert('error!'));

function addPhones(phones) {
    for (let i=0; i< phones.length; i++) {
        let ulBox = document.querySelector('.phone-conteiner');

        let liBox = document.createElement('li');
        liBox.className = 'liBox';

        let divImg =  document.createElement('div');
        divImg.className = 'divImg';
        liBox.appendChild(divImg);

        let liImg = document.createElement('img');
        liImg.className = 'liImg';
        liImg.setAttribute("src", phones[i].img);
        divImg.appendChild(liImg);

        let spanPrice = document.createElement('span');
        spanPrice.className = 'spanPrice';
        spanPrice.innerHTML = `${phones[i].price} $`;
        liBox.appendChild(spanPrice);

        let btn = document.createElement('button');
        btn.className = 'buy';
        btn.innerHTML = 'buy';
        liBox.appendChild(btn);

        ulBox.appendChild(liBox);
    }
}


function makeQueryString(event) {
    let str = '';
    let sort = event.target.closest('.sortetBy');
    if (sort) {
        str = sort.getAttribute('data-sort');
    };
    // let ulBox = document.querySelector('.phone-conteiner');

    let stringBrands = '';
    let brands = allFilter.querySelectorAll('.brand');
    for (let i = 0; i < brands.length; i++) {
        if (brands[i].checked) {
            stringBrands += 'name=' + brands[i].id +'&';
        }

    }
    return stringBrands + '&' + str;
}

function doRequest(event) {
    let str = makeQueryString(event);
    console.log(str)
    let ulBox = document.querySelector('.phone-conteiner');
    fetch('http://localhost:3000/phones?' + str)
        .then(function(response) {
            ulBox.innerHTML = '';
            return response.json();
        })
        .then(function(response) {
            addPhones(response);
        })
        .catch(() =>  alert('error!'));
}