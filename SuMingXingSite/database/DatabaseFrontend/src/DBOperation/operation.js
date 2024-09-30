const ROOT = "http://192.168.0.13:8000/"

const ADD_ORDER_PATH = ROOT + "database/addOrder"
const GET_ORDER_PATH = ROOT + "database/getOrder"
const EDIT_ORDER_PATH = ROOT + "database/editOrder"
const DELETE_ORDER_PATH = ROOT + "database/deleteOrder"


// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const JSON_HEADER = {
    'Content-Type':'application/json',
    // 'X-CSRFToken': csrfToken
}

export function addOrder(order){
    fetch(ADD_ORDER_PATH, {
        method:'POST',
        headers:JSON_HEADER,
        body: JSON.stringify(order)
    }).then(response => {
        return response.json()
    }).then(data =>{
        console.log("received:",data);
    }).catch(err =>{
        console.log('error:', err);
    })
}

export async function getOrders(filter){
    try{
        let json_response = await fetch(GET_ORDER_PATH, {
            method:'POST',
            headers:JSON_HEADER,
            body: JSON.stringify(filter)
        }).then(response =>{
            return response.json();
        }).catch(err =>{
            return err;
        });
        console.log("Got orders!", json_response)
        return json_response.data

    }catch (err){
        console.log("some error!",err);
        return err
    }
     
}

export async function editOrder(order){
    await fetch(EDIT_ORDER_PATH, {
        method:'POST',
        headers:JSON_HEADER,
        body: JSON.stringify(order)
    }).then(response => {
        return response.json()
    }).then(data =>{
        console.log("edited!:",data);
    }).catch(err =>{
        console.log('error:', err);
    })
}

export async function deleteOrder(order){
    await fetch(DELETE_ORDER_PATH, {
        method:'POST',
        headers:JSON_HEADER,
        body: JSON.stringify(order)
    }).then(response => {
        return response.json()
    }).then(data =>{
        console.log("deleted!:",data);
    }).catch(err =>{
        console.log('error:', err);
    })
}