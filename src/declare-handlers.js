import { getArrayOfBrends } from "./checkbox-operations";
import { generateLink } from './generate-link';
import { reRenderList } from './fill-ul';

export const declareHandlers = () => {
    const wrap = document.getElementById("wrapper");
    wrap.addEventListener("click", e => {
        const target = e.target;
        const id = target.id || null;
        const type = target.getAttribute("type");
        type === "checkbox" ?
            (() => {
                const ul = document.getElementById("gallery-list");
                console.log(ul)
                var brendArr = getArrayOfBrends();
                const link = generateLink(brendArr);
                reRenderList("gallery-list",link)
            })() :
            null;
    })
}
