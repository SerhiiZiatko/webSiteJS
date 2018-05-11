class Item {
    constructor() {

        this.arrayItem = [];
        this.render();
        this.content = document.getElementsByClassName("content")[0];
        this.sortUP =  document.getElementById("up");
        this.sortUP.addEventListener('click', this.sortUp.bind(this));

        this.sortDOWN =  document.getElementById("down");
        this.sortDOWN.addEventListener('click', this.sortDown.bind(this));

        this.popularityUP =  document.getElementById("upPopularity");
        this.popularityUP.addEventListener('click', this.popularityUp.bind(this));

        this.popularityDOWN =  document.getElementById("downPopularity");
        this.popularityDOWN.addEventListener('click', this.popularityDown.bind(this));


        this.form = document.getElementById("filter-form");
        this.filterP =  document.getElementById("submit");
        this.filterP.addEventListener('click', this.filter.bind(this));

        this.checkoutItem = document.getElementById('checkout');
        this.checkoutItem.addEventListener('click', this.checkout.bind(this));

        this.renderCard = document.getElementById('cart');
        this.renderCard.addEventListener('click', this.creareformCart.bind(this));

    }

    render() {

        fetch('http://localhost:3000/item')
            .then((res) => res.json())
            .then((data) => {
                this.arrayItem = data;
                this.createForm(this.arrayItem);

            });
    }
    filter(e) {
        this.filterItem='';
        if(e.target.classList.contains('submit')) {
            const checked = this.form.querySelectorAll("input:checked");
            checked.forEach((check) => {
                this.filterItem += `${check.name}=${check.value}&`;
            })

            this.content.innerHTML = '';
            if(checked.length == 0) {
                this.render();
            } else  {
            this.getFilterItem();
            }
        }

        e.preventDefault();
    }


    getFilterItem() {

        fetch(`http://localhost:3000/item?${this.filterItem}`)
            .then((res) => res.json())
            .then((data) => {
                this.arrayItem = data;
                this.createForm(this.arrayItem);

            });

    }

    sortUp() {

        this.content.innerHTML = '';

        this.arrayItem.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);} );

        this.createForm(this.arrayItem);



       }
     sortDown() {
         this.content.innerHTML = '';

         this.arrayItem.sort(function(a,b) {return (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0);} );

         this.createForm(this.arrayItem);
     }

    popularityUp() {

        this.content.innerHTML = '';
        this.arrayItem.sort(function(a,b) {return (a.popularity > b.popularity) ? 1 : ((b.popularity > a.popularity) ? -1 : 0);} );

        this.createForm(this.arrayItem);





    }
    popularityDown() {

        this.content.innerHTML = '';
        this.arrayItem.sort(function(a,b) {return (a.popularity < b.popularity) ? 1 : ((b.popularity < a.popularity) ? -1 : 0);} );

        this.createForm(this.arrayItem);

    }

    addToCard (e) {
        let cartData =  JSON.parse(localStorage.getItem('cart')) || {},
            itemId = e.target.dataset.id,
            itemTitle = e.target.dataset.name,
            itemPrice = e.target.dataset.price;
        if(cartData.hasOwnProperty(itemId)){
            cartData[itemId][2] += 1;
        } else { 
            cartData[itemId] = [itemTitle, itemPrice, 1];
        }
        localStorage.setItem('cart', JSON.stringify(cartData));
        console.log(cartData);


    }
    creareformCart() {
        this.divOrder = document.getElementsByClassName('container-on-card')[0];
        this.divOrder.innerHTML='';
        let cartData = JSON.parse(localStorage.getItem('cart'));
            for(var items in cartData){
                this.wrapper = document.createElement('div');
                this.wrapper.classList.add('wrapper-order-items');
                this.divOrder.appendChild(this.wrapper);
            for(var i = 0; i < cartData[items].length; i++){
            this.span = document.createElement('span');
            this.span.classList.add("span-order")
            this.span.innerText =  cartData[items][i];
            this.wrapper.appendChild(this.span);
            }

        }
    }
    checkout() {

        localStorage.clear();
        this.divOrder.innerHTML='';

    }
     createForm(obj) {
        for(let i = 0; i <= obj.length; i++) {
            this.div = document.createElement("div");
            this.image = document.createElement("img");
            this.name = document.createElement("span");
            this.price = document.createElement("span");
            this.button = document.createElement("button");


            this.div.classList.add("item-info");
            this.image.classList.add("item-img");
            this.image.setAttribute("src", obj[i].im);
            this.name.innerText = obj[i].name;
            this.price.innerText = "$" + obj[i].price;
            this.button.innerHTML = "Add to cart";
            this.button.classList.add("button-cart");
            this.button.dataset.id = obj[i].id;
            this.button.dataset.price = obj[i].price;
            this.button.dataset.name = obj[i].name;

            this.button.addEventListener('click', this.addToCard.bind(this));

            this.content.appendChild(this.div);
            this.div.appendChild(this.image);
            this.div.appendChild(this.name);
            this.div.appendChild(this.price);
            this.div.appendChild(this.button);

        }


     }



}
let list = new Item();