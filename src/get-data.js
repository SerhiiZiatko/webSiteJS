export default async (url = "http://localhost:3000/phones") => {
    const request = await fetch(url);
    const data = await request.json();
    const status = request.status;
    return status ===200 ? data : null;
}