import setText, { appendText } from "./results.mjs";

export function timeout() {
    const wait = new Promise((resolve) =>{
        setTimeout(()=>{
            resolve("Timeout !")
        },1500);
    })
    wait.then((data)=>{
        return setText(data);
    })
}

export function interval() {
    let count = 0;
    const wait = new Promise((resolve) =>{
        setInterval(()=>{
            console.log(`Interval`)
            resolve(`Timeout ! ${++count}`)
        },1500);
    })
    wait.then((text)=>{
        return setText(text);
    })
    .finally(()=> {
        appendText(`-- Done -- ${count}`)
    })
}

export function clearIntervalChain() {
    let count = 0;
    let interval;
    const wait = new Promise((resolve) =>{
         interval = setInterval(()=>{
            console.log(`Interval`)
            resolve(`Timeout ! ${++count}`)
        },1500);
    })
    wait.then((text)=>{
        return setText(text);
    })
    .finally(()=> {
        clearInterval(interval);
    })
}

export function xhr() {
    let request = new Promise((resolve, reject) =>{
        let xhr = new XMLHttpRequest();
        xhr.open("GET","http://localhost:3000/users/7");
        xhr.onload = () => {
            if(xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText)
            }
            
        }
        xhr.onerror = () => reject ("Request Error");
        xhr.send();
    });
    request
    .then(result=> {
        setText(result);
    })
    .catch(err => setText(err))
}

export function allPromises() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addresseTypes = axios.get("http://localhost:3000/addressesTypes");

    Promise.all([categories,statuses,userTypes, addresseTypes])
    .then(([cat,stat,types,addres]) => {
        setText(" ");

        appendText(JSON.stringify(cat.data));
        appendText(JSON.stringify(stat.data));
        appendText(JSON.stringify(types.data));
        appendText(JSON.stringify(addres.data));

    })
    .catch(err => setText(err));
}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addresseTypes = axios.get("http://localhost:3000/addressesTypes");

    Promise.allSettled([categories, statuses, userTypes, addresseTypes])
    .then((values) => {
        let results = values.map(v => {
            if (v.status === "fulfilled") {
                return `FULFFILLED : ${JSON.stringify(v.value.data[0])} `
            } else {
                return `REJECTED : ${v.reason.message} `
            }
        })

        setText(results);

    })
    .catch(err => setText(err));
}


export function race() {

    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3000/users");

    Promise.race([users,backup])
    .then(users => {
        setText(JSON.stringify(users.data))
    })
    .catch(reason => setText(reason))
}
