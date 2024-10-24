import { useCutomerInfo, useCutomerInfoDispatch } from "./OrderHook";
import { useState } from "react";

import { AddButton, DeleteButton } from "../Component/Button";
import { TextInput } from "../Component/Input";

/*
customer_info:{
    name:str, // required
    phone_list:[, //optional, default empty array
        {
            id:int, 
            number:str,
        },...
    ]
    order_time:str // required
    pickup_time:str // required
}
*/

export function CustomerInfo(){
    let customer_info = useCutomerInfo();
    let dispatch = useCutomerInfoDispatch();

    let handleChangeNameEvent = (value) =>{
        dispatch({
            "type":"changeName",
            "name":value
        })
    }
    let name_className = "px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300"
    let name_style = {
        width:customer_info.name.length * 2 + "ch",
        minWidth:"12ch"

    }
    
    const [id, setID] = useState(customer_info.phone_list.length)
    let handleAddEmptyPhoneEvent = ()=>{
        dispatch({
            "type":"addEmptyPhone",
            "id":id
        });
        setID(id + 1);
    }
    let phone_number_className = "px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300";

    let handleChangeOrderTimeEvent = (value)=>{
        dispatch({
            "type":"changeOrderTime",
            "order_time":value
        })
    }
    let order_time_className = "px-0.5 text-nowrap col-span-3 outline-0 border border-stone-500 bg-white focus:ring-2 rounded-md hover:bg-slate-300"
    let handleChangePickupTimeEvent = (value)=>{
        dispatch({
            "type":"changePickupTime",
            "pickup_time":value
        })
    }
    let pickup_time_className = "px-0.5 text-nowrap col-span-3 outline-0 border border-stone-500 bg-white focus:ring-2 rounded-md hover:bg-slate-300"

    return ( 
        <>
            <div className="p-1 border-y-2 grid grid-cols-2 gap-1 justify-items-center">
                <span>訂購人姓名：</span>
                <TextInput handleChangeEvent={handleChangeNameEvent} value={customer_info.name} className={name_className} style={name_style}/>
                <div className="col-span-2 border-y-2 py-0.5 w-3/4 flex justify-center gap-1">
                    <span> 訂購人電話 </span>
                    <AddButton handleClickEvent={handleAddEmptyPhoneEvent} />
                </div>
                {customer_info.phone_list.map(phone =>{
                    let handleDeleteClickEvent = ()=>{
                        dispatch({
                            "type":"deletePhoneNumber",
                            "id":phone.id
                        });
                    }            
                    let handlePhoneNumberChange = (value)=>{dispatch({
                        "type":"changePhoneNumber",
                        "id":phone.id,
                        "number":value,
                    })}
                    let phone_number_style = {
                        width:(phone.number.length + 0.5) + "ch",
                        minWidth:"10.5ch"
                    }
                    return(
                    <div key={phone.id} className="flex justify-center">
                        <TextInput handleChangeEvent={handlePhoneNumberChange} value={phone.number} className={phone_number_className} style={phone_number_style}/>
                        <DeleteButton handleClickEvent={handleDeleteClickEvent} />
                    </div>
                )})}
            </div>
            <div className="p-1 grid grid-cols-4 gap-1 justify-items-center items-center">
                <span className="">訂購時間</span>
                <TextInput handleChangeEvent={handleChangeOrderTimeEvent} value={customer_info.order_time} className={order_time_className} type="date"/>
                <span className="text-nowrap">取貨時間</span>
                <TextInput handleChangeEvent={handleChangePickupTimeEvent} value={customer_info.pickup_time} className={pickup_time_className} type="date"/>
            </div>
        </>
    );
}