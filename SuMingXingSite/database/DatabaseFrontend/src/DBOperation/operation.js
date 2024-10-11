const ROOT = "http://192.168.0.14:8000/"

const ADD_ORDER_PATH = ROOT + "database/addOrder"
const GET_ORDER_PATH = ROOT + "database/getOrder"
const EDIT_ORDER_PATH = ROOT + "database/editOrder"
const DELETE_ORDER_PATH = ROOT + "database/deleteOrder"

const SUCCESS = "Success"
const ERROR = "Error"
const DETAIL = "Detail"

// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const JSON_HEADER = {
    'Content-Type':'application/json',
    // 'X-CSRFToken': csrfToken
}

/*
result :{
    "JSStatus":"Sucess" or "Error"
    "data":received data
}
*/

async function operation(path, postData) {
    try{
        const controller = new AbortController();
        const timeoutID = setTimeout(()=>{controller.abort()}, 5000) // abort fetching after 5 second
        // checkout https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#signal
        const response = await fetch(path, {method:'POST',headers:JSON_HEADER,body: JSON.stringify(postData), signal:controller.signal})
        clearTimeout(timeoutID)
        const data = await response.json()
        let result;
        if (data["Django Status"] === SUCCESS){
            result = {
                "JSStatus":SUCCESS,
                "data":data[DETAIL],
            }
        }else{
            result = {
                "JSStatus":ERROR,
                "data":data[DETAIL],
            }
        }
        return result
    }catch(error){
        let result = {
            "JSStatus":ERROR,
            "data":"連線有問題！看看是不是電腦待機或關機了",
        }
        if (error.name === "AbortError"){
            result.data = "超時！看看是不是電腦待機或關機了"
        }        
        return result        
    }
}

export async function addOrder(order){
    return await operation(ADD_ORDER_PATH, order)
}

export async function getOrders(filter){
    return await operation(GET_ORDER_PATH, filter)
}

export async function editOrder(order){
    return await operation(EDIT_ORDER_PATH, order)
}

export async function deleteOrder(order){
    return await operation(DELETE_ORDER_PATH, order)
}