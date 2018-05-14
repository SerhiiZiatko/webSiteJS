const baseUrl = "http://localhost:3000/phones";
const filterBaseUrl = "http://localhost:3000/phones?title=json-server";

export const generateLink = (value1 = null, value2 = null) => {
    let result = null;

    if (Array.isArray(value1) && value1.length > 0) {
        const filterString = "&brend=" + value1.join("&brend=");
        const url = filterBaseUrl + filterString;
        console.log(url);
        return result = url;
    } else if (
        value1 instanceof Array &&
        value2 instanceof Object
    ) {
        const url = `${baseUrl}?_sort=${value2.sort}&_order=${value2.order}`;
        console.log(url);
        return result = url;
    }
    console.log(result);
    return result || baseUrl;

    //     !Array.isArray(value1) &&
    //         typeof value1 === "object" &&
    //         value1 !== undefined &&
    //         value2 === undefined ?
    //         (() => {
    //             console.log("VARIANT2")
    //             const url = `${baseUrl}?_sort=${value1.sort}&_order=${value1.order}`;
    //             return result = url;
    //         })() :
    //         null;
    //     return result || baseUrl;
    // }

    // export const generateLink = (val1,val2) => {

}