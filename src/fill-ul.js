import {
    createElem,
    createElemWithClass
} from "./create-element";
import createCard from "./create-card";
import getDAta from "./get-data";
import getData from "./get-data";


const createUlFragment = array => {
    const fragment = document.createDocumentFragment();
    console.log(array)
    for (let item of array) {
        const li = createElemWithClass("li", "list-item");
        let {
            id,
            src,
            price,
            name,
            brend
        } = item;
        createElem({
            "tagname": "li",
            "classes": `list-item list-item${id}`
        });
        let card = createCard(src, price, id);
        li.appendChild(card);
        fragment.appendChild(li);
    }
    return fragment;
}

const createNewUl = (id, array, callback = createUlFragment) => {
    const ul = document.getElementById(id);
    const fragment = callback(array);
    ul.appendChild(fragment);
}

export const renderList = async (id, url,callback = createNewUl) => {
    const array = await getData();
    console.log(array)
    return callback(id, array);
    
}
export const reRenderList = async (id, url,callback = createNewUl) => {
    const array = await getData(url);
    const ul = document.getElementById(id);
    ul.innerHTML = null;
    return callback(id,array);
    
}