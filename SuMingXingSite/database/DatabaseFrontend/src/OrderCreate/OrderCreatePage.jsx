import { Order } from "../Order/Order"
import { getTodayString } from "../Utils/dateprocessing"


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