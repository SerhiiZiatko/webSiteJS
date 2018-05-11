import "babel-polyfill";
import "./styles/main.css";
import getData from "./get-data";
import {renderList,reRenderList } from "./fill-ul";
import { declareHandlers } from "./declare-handlers"
import { generateLink } from "./generate-link";

( () => {
    renderList("gallery-list");
    declareHandlers();
    reRenderList("gallery-list",generateLink({
        sort: "price",
        order: "asc"
    }))
})()