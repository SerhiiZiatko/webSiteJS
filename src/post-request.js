export default async (obj, url = "http://localhost:3000/basket") => {

    const request = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
        // .catch(()=>{console.log("ERROR")})
    });
    const data = await request.json();
    const status = await request.status;
    status === 201 ?
        (() => {
            const list = document.getElementsByClassName("list")[0];
            addUserToList(data, list);

        })() : null;
}