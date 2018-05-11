export const getArrayOfBrends = () => {
    const checkboxes = [...document.querySelectorAll("[type='checkbox']")];
    const brendArr = (checkboxes.map(item => item.checked ? item.dataset.brend : null)).filter(item => !!item )
    console.log(brendArr);
    return brendArr;
}