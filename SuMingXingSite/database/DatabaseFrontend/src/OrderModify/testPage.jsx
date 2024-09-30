const initial_order = {
    "status":"finished",
    "customer_info":{
        "name":"123456789",
        "phone_list":[{id:0, number:"0916359399"}], // [{id:phone id, number: phone number}, {...}, ...]
        "order_time":"2024-09-28",
        "pickup_time":"2024-09-28",
    },
    "item_list":[ 
        {id:0, name:"test1", amount:10, sub_item_list:[]}
    ],
}

import { Order } from "../Order/Order";

export function Test(){
    return (
        <>
            <Order order={initial_order} current_page={"test"}/>
        </>
    );
}