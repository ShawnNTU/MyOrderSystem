import { useEffect } from "react";

export function useUpdateOrder(order, setStatus, customer_info_dispatch, item_list_dispatch){
    useEffect(()=>{
        setStatus(order.status);
        customer_info_dispatch({
            "type":"UpdateCustomerInfo",
            "new_customer_info":order.customer_info
        })
        item_list_dispatch({
            "type":"UpdateItemList",
            "new_item_list":order.item_list
        })
    },[order, setStatus, customer_info_dispatch, item_list_dispatch])
}