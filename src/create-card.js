import {
    createElem,
    createElemWithClass,
    addElem
} from "./create-element";
export default (href, value, identificator) => {
    const figure = createElemWithClass("figure", "card-elem")
    const img = createElem({
        tagname: "img",
        classes: "elem-img",
        attr: [{
                name: "src",
                value: href,
            },
            {
                name: "alt",
                value: `Item ${value}`
            }
        ]
    })
    const bottomPart = createElemWithClass("figcapture", "card-bottom-part");
    const price = createElem({
        tagname: "span",
        classes: "span-price",
        text: value
    })
    const buyBtn = createElem({
        tagname: "span",
        classes: "buy-btn",
        html: '<i class="fas fa-shopping-basket"></i>'
    })
    addElem(bottomPart, [price, buyBtn]);
    addElem(figure, [img, bottomPart]);
    return figure;
}