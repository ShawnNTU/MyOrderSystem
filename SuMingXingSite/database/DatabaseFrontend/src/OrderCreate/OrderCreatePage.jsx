import { Order } from "../Order/Order"

function getTodayString(){
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1 // month is 0-based
    month = (month < 10 ? `0${month}` : `${month}`)
    let date = now.getDate()
    date = (date < 10 ? `0${date}` : `${date}`)
    return `${year}-${month}-${date}`
}

export default function OrderCreatePage(){
    let today = getTodayString()
    const initial_order = {
        "status":"unfinished",
        "customer_info":{
            "name":"",
            "phone_list":[], // [{id:phone id, number: phone number}, {...}, ...]
            "order_time":today,
            "pickup_time":today,
        },
        "item_list":[],
    }
    return(
        <div className="mx-1">
            <Order order={initial_order} current_page={"create"}/>
        </div>
    )
}