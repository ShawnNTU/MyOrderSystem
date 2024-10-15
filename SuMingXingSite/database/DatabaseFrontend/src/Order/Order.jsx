import { useState } from "react";
import { useImmerReducer } from "use-immer";

import { CustomerInfo } from "./CustomerInfo";
import { ItemList } from "./ItemList";
import { OrderStatus } from "./OrderStatus";

import { CustomerInfoProvider } from "./OrderProvider";
import { CustomerInfoReducer, ItemListReducer } from "./OrderReducer";
import { ItemListDispatchContext } from "./OrderContext";

import { deleteOrder, addOrder, editOrder } from "../DBOperation/operation";

import { ToggleButton, DeleteButton, SubmitButton, FinishButton } from "../Component/Button";

import Swal from 'sweetalert2'
import { useReloadContext } from "./OrderHook";
import { isGuei } from "./Format";

const DELETE_FUNCTION = {
    "create":()=>{},
    "modify":deleteOrder,
    "test":()=>{},
}

const SUBMIT_FUNCTION = {
    "create":addOrder,
    // "modify":editOrder,
    "modify":console.log,
    "test":console.log,
}

/*
order format : {
    status: // required, "finished" or "unfinished"
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
    item_list:[ // required
        {
            id:
            name:
            amount:
            sub_item_list:[ // depend on the type of the item
                {
                    sub_id
                    sub_name:,
                    sub_amount:
                }
            ]
        }
        
    ]
}
*/

function DisplayMode({status, customer_info, item_list}){
    return (
        <>
            <div className="py-1 border-y border-y-stone-500 text-center">訂單狀態 : {status === "finished" ? "完成" : "未完成"}</div>
            <div className="py-1 px-3 grid grid-flow-col grid-cols-2 grid-rows-4 text-center">
                <div className="py-1 border-t border-neutral-300">訂購人姓名</div>
                <div className="py-1 border-t border-neutral-300">訂購人電話</div>
                <div className="py-1 border-t border-neutral-300">訂購時間</div>
                <div className="py-1 border-y border-neutral-300">取貨時間</div>
                <div className="py-1 border-t border-neutral-300">{customer_info.name}</div>
                <div className="py-1 border-t border-neutral-300">{customer_info.phone_list.map(phone=>{return (<div key={phone.id}>{phone.number}</div>)})}</div>
                <div className="py-1 border-t border-neutral-300">{customer_info.order_time}</div>
                <div className="py-1 border-y border-neutral-300">{customer_info.pickup_time}</div>
            </div>
            <div className="py-1 text-center border-y border-stone-500">訂單內容</div>
            <div className="my-1">
                {item_list.map(item=>{return (
                    <ul key={item.id} className="ml-4 list-inside list-disc">
                        <li>{item.name + " : " + item.amount + (isGuei(item.name) ? "斤" : "個")}</li>
                        <ul className="ml-4 list-inside list-disc">
                            {item.sub_item_list.map(sub_item=>{return (<li key={sub_item.sub_id}>{sub_item.sub_name + " : " +sub_item.sub_amount}</li>)})}
                        </ul>
                    </ul>
                )})}
            </div>
        </>
    );
}

export function Order({order, current_page}){
    // split into two part:customer_info & item_list
    // each has it own reducer
    const [status, setStatus] = useState(order.status);
    const [customer_info, customer_info_dispatch] = useImmerReducer(CustomerInfoReducer, order.customer_info);
    const [item_list, item_list_dispatch] = useImmerReducer(ItemListReducer , order.item_list);

    let edit_init = current_page === "modify" ? false : true 
    const [editing, setEditing] = useState(edit_init)
    let open_init = current_page === "modify" ? false : true 
    const [opening, setOpening] = useState(open_init);

    let reload_order = useReloadContext()

    let handleSubmitEvent = async ()=>{
        let checked_result = checkFormat(customer_info, item_list)
        if (checked_result.length !== 0){
            Swal.fire({
                title:"格式不符!",
                text:checked_result,
                icon:"warning"
            })
        }else{
            if (current_page === "modify"){
                Swal.fire({
                    title:"確定要修改嗎",
                    icon:"info",
                    showConfirmButton:true,
                    showCancelButton:true,
                    allowOutsideClick:false,
                    showLoaderOnConfirm:true,
                    preConfirm:async()=>{
                        return await editOrder({_id:order._id,data:deepcopyAndReindex(status, customer_info, item_list)})  
                    }
                }).then(result=>{
                    if (result.isConfirmed){
                        if (result.value.JSStatus === "Success"){
                            Swal.fire({
                                title:"修改成功",
                                icon:"success",                            
                            }).then(()=>{
                                reload_order();
                            })
                        }else{
                            console.log(result)
                            Swal.fire({
                                title:"修改失敗",
                                icon:"error",   
                                text:result.value.data,                                                        
                            }).then(()=>{
                                reload_order();
                            })
                        }                        
                    }
                })
            }else{
                Swal.fire({
                    title:"確定要新增嗎",
                    icon:"info",
                    showConfirmButton:true,
                    showCancelButton:true,
                    allowOutsideClick:false,
                    showLoaderOnConfirm:true,
                    preConfirm:async()=>{
                        return await addOrder(deepcopyAndReindex(status, customer_info, item_list))
                    }
                }).then(result=>{
                    if (result.isConfirmed){
                        if (result.value.JSStatus === "Success"){
                            Swal.fire({
                                title:"新增成功",
                                icon:"success",                            
                            })
                        }else{
                            console.log(result)
                            Swal.fire({
                                title:"新增失敗",
                                icon:"error",   
                                text:result.value.data,                                                        
                            })
                        }
                    }
                })
                
            }
        }
    }

    let handleDeleteEvent = async ()=>{
        if (current_page === "modify"){
            Swal.fire({
                title:"確定要刪除嗎",
                icon:"info",
                showConfirmButton:true,
                showCancelButton:true,
                allowOutsideClick:false,
                showLoaderOnConfirm:true,
                preConfirm:async()=>{
                    // order._id is automatically created by MongoDB
                    return await deleteOrder(order._id)
                }
            }).then(result=>{
                if (result.isConfirmed){
                    if (result.value.JSStatus === "Success"){
                        Swal.fire({
                            title:"刪除成功",
                            icon:"success",                            
                        }).then(()=>{
                            reload_order();
                        })
                    }else{
                        console.log(result)
                        Swal.fire({
                            title:"刪除失敗",
                            icon:"error",   
                            text:result.value.data,                                                        
                        }).then(()=>{
                            reload_order();
                        })
                    }                    
                }
            })
        }
    }

    let handleFinishEvent = async ()=>{
        if (current_page === "modify"){
            Swal.fire({
                title:"確定要完成訂單嗎",
                icon:"info",
                showConfirmButton:true,
                showCancelButton:true,
                allowOutsideClick:false,
                showLoaderOnConfirm:true,
                preConfirm:async()=>{
                    return await editOrder({_id:order._id,data:deepcopyAndReindex("finished", customer_info, item_list)})  
                }
            }).then(result=>{
                if (result.isConfirmed){
                    if (result.value.JSStatus === "Success"){
                        Swal.fire({
                            title:"修改成功",
                            icon:"success",                            
                        }).then(()=>{
                            reload_order();
                        })
                    }else{
                        console.log(result)
                        Swal.fire({
                            title:"修改失敗",
                            icon:"error",   
                            text:result.value.data,                                                        
                        }).then(()=>{
                            reload_order();
                        })
                    }                        
                }
            })
        }
    }

    let content;
    if (opening){
        if (!editing){
            content = <DisplayMode status={status} customer_info={customer_info} item_list={item_list}/>
        }else{
            content = (
                <>
                    <OrderStatus status={status} setStatus={setStatus} />
                    <CustomerInfoProvider context={customer_info} dispatch={customer_info_dispatch}>
                        <CustomerInfo />
                    </CustomerInfoProvider>
                    <ItemListDispatchContext.Provider value={item_list_dispatch}>
                        <ItemList item_list={item_list} />
                    </ItemListDispatchContext.Provider>
                    <SubmitButton current_page={current_page} 
                        handleClickEvent={handleSubmitEvent}
                    />
                </>
            )
        }
    }else{
        content = (
            <div className="mr-auto">訂購者：{customer_info.name}</div>
        )
    }

    
    
    return (
        <div className={"my-1 rounded-md shadow-lg text-xl border-8 " + (status === "finished" ? "border-lime-300" : "border-amber-500/70")}>
            {/* function bar */}
            <div className="py-1 m-1 flex justify-end gap-1">
                {!opening && content}
                <ToggleButton state={opening} setState={setOpening} type={"opening"}/>
                <ToggleButton state={editing} setState={setEditing} type={"editing"}/>
                {status === "finished" ? null : <FinishButton handleClickEvent={handleFinishEvent} />}
                <DeleteButton handleClickEvent={handleDeleteEvent} />
            </div>
            {opening && content}
        </div>
    );
}

// TODO:Add More Checking
function checkFormat(customer_info, item_list){
    let checked_result = "";
    if (customer_info.name === ""){
        checked_result += "名字沒有填!\n"
    }
    if (customer_info.order_time === ""){
        checked_result += "訂購時間沒有填!\n"
    }
    if (customer_info.pickup_time === ""){
        checked_result += "取貨時間沒有填!\n"
    }
    if (item_list.length === 0){
        checked_result += "訂單沒有填!\n"
    }

    return checked_result
}

function deepcopyAndReindex(status, customer_info, item_list){
    let new_phone_list = customer_info.phone_list.map((phone, index)=>{
        return {...phone, id:index}
    })
    let new_customer_info = {...customer_info, phone_list:new_phone_list}

    let new_item_list = item_list.map((item, index)=>{
        let new_sub_item_list = item.sub_item_list.map((sub_item, sub_index)=>{
            return {...sub_item, sub_id:sub_index}
        })
        return {...item, id:index, sub_item_list:new_sub_item_list}
    })
    return {status:status, customer_info:new_customer_info, item_list:new_item_list}
}