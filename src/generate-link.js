const baseUrl = "http://localhost:3000/phones";
const filterBaseUrl = "http://localhost:3000/phones?title=json-server";

export const generateLink = (value1, value2) => {
    let result = null;
    Array.isArray(value1) &&
        value1.length > 0 ?
        (() => {

            const filterString = "&brend=" + value1.join("&brend=");
            const url = filterBaseUrl + filterString;

            return result = url;
        })() :
        null;


    !Array.isArray(value1) &&
        typeof value1 === "object" &&
        value1 !== undefined &&
        value2 === undefined ?
        (() => {
            console.log("VARIANT2")
            const url = `${baseUrl}?_sort=${value1.sort}&_order=${value1.order}`;
            return result = url;
        })() :
        null;
    console.log(`LINK ${result}`)
    return result || baseUrl;
}