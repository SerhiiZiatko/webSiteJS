export const createElemWithClass = (tag, ...classes) => {
    const elem = document.createElement(tag);
    for (let item of classes) {
        elem.classList.add(item);
    }
    return elem;
}
export const addElem = (parentElem,arrayOfElems) => {
    for(let item of arrayOfElems){
        parentElem.appendChild(item);
    }
}

export const createElem = params => {
    const elem = document.createElement(params.tagname);
    elem.className = params.classes || null;
    params.text ? (() => {
        elem.innerText = params.text
    })() : null;

    if (params.attr) {
        Array.isArray(params.attr) === true ?
            (() => {
                for (let item of params.attr) {
                    let {
                        name,
                        value
                    } = item;
                    elem.setAttribute(name, value);
                }
                // console.log("arr is true")
            })() :
            null;
    }
    if (params.styles) {
        Array.isArray(params.styles) === true ?
            (() => {
                for (let item of params.styles) {
                    let {
                        name,
                        value
                    } = item;
                    elem.style[name] = value;
                }
            })() :
            null
    }
    if (params.html) {
        elem.innerHTML = params.html;
    }

    return elem;
}