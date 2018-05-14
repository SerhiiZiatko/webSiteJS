import { getArrayOfBrends } from "./filter-operations";
import { generateLink } from './generate-link';
import { reRenderList } from './fill-ul';
import { getDataAttr } from './sort-operations';

export const declareHandlers = () => {
    const wrap = document.getElementById("wrapper");
    wrap.addEventListener("click", e => {
        const target = e.target;
        const id = target.id || null;
        const className = target.className;
        const type = target.getAttribute("type");

        if(type === "checkbox"){
            const ul = document.getElementById("gallerry-list");
            const brendArr = getArrayOfBrends();
            const link = generateLink(brendArr);
            reRenderList(link)
        }
        if(className.indexOf("fa-arrow-up")>=0 || className.indexOf("fa-arrow-down") >=0 ){
            const dataAttr = getDataAttr(target);
            const brendArr = getArrayOfBrends();
            const link = generateLink(brendArr,dataAttr);
            reRenderList(link)
        }


    })
}
