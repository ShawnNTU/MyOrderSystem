import { Fragment, useState } from "react";

import { TextInput} from "../Component/Input";
import { getOrders } from "../DBOperation/operation";
import { DropdownMenu } from "../Component/DropdownMenu";
import { getAvailableSnippet } from "./Format";
import { AddButton, DeleteButton } from "../Component/Button";


import Swal from "sweetalert2";

/*
filter_rule = {
     "status":"finished",
     "name":"",
     "phone_number":"",
     "item_list":[],
     "types":"pickup_time",
     "start_time":getTodayString(), // default is today
     "end_time":"", // default is ""
}
*/

export function OrderFilter({filter_rule, setFilterRule, setOrders}){
    

    const [button_text, setButtonText] = useState("按下後開始篩選!");
	const [button_disable, setButtonDisable] = useState(false);

    const [filter_item, setFilterItem] = useState("")
    const [filter_item_ID, setFilterItemID] = useState(0)

    function handleAddItem(){
        if (filter_item !== ""){
            setFilterRule(draft=>{
                draft.item_list.push({"id":filter_item_ID,"item_name":filter_item})
            })
            setFilterItemID(filter_item_ID + 1)
        }
    }
    
    function handleRowClickEvent(value){
        setFilterItem(value)
    }

    return (
        <>
            <div className="my-2 py-1 text-lg bg-neutral-100 rounded-md border grid grid-cols-3 grid-rows-4 gap-1 justify-items-center">
                {/* filter order status */}
                
                <div className="row-start-2 bg-yellow-300 rounded-md px-1">狀態</div>
                <select className="row-start-3 h-8 bg-white rounded-md outline-none border border-stone-500 focus:ring-2"
                    value={filter_rule.status}
                    onChange={e=>{
                        setFilterRule(draft=>{
                            draft.status = e.target.value;
                        })
                }}>
                    {/* default is unfinished */}
                    <option value="unfinished">未完成</option> 
                    <option value="finished">完成</option>
                    <option value="">都要</option>
                </select>
                
                

                {/* filtering customer name */}
                
                <div className="col-start-2 col-span-2 bg-yellow-300 rounded-md px-1">訂購者名稱含有</div>
                <input type="text" 
                    value={filter_rule.name}
                    className="col-start-2 col-span-2 w-5/6 px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300"
                    onChange={e=>{
                        setFilterRule(draft =>{
                            draft.name = e.target.value;
                        })
                    }}
                />
                
                
                {/* filtering customer phone number */}
            
                <div className="col-start-2 col-span-2 bg-yellow-300 rounded-md px-1">訂購者電話含有</div>
                <input type="text" 
                    value={filter_rule.phone_number}
                    className="col-start-2 col-span-2 w-5/6 px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300"
                    onChange={e=>{
                        setFilterRule(draft =>{
                            draft.phone_number = e.target.value;
                        })
                    }}
                />
            </div>    
            {/* filtering item name */}
            <div className="my-2 py-1 text-lg bg-neutral-100 rounded-md border">
                <div className="flex justify-center items-center gap-1">
                    <div className="bg-yellow-300 rounded-md px-1">訂購項目含有</div>
                    <DropdownMenu display_value={filter_item} snippet={getAvailableSnippet("")} handleRowClickEvent={handleRowClickEvent} />
                    <AddButton handleClickEvent={handleAddItem} />
                </div>
                <div className="grid grid-cols-2 gap-1 w-full">                    
                    {filter_rule.item_list.map(obj =>{
                        function handleDeleteItem(){
                            setFilterRule(draft=>{
                                draft.item_list = draft.item_list.filter(item=>{
                                    return item.id !== obj.id
                                })
                            })
                        }

                        return (
                            <div key={obj.id} className="flex justify-center gap-1">
                                <div className="bg-white p-0.5 border border-stone-300 rounded-md">{obj.item_name}</div>
                                <DeleteButton handleClickEvent={handleDeleteItem} />
                            </div>                        
                        )
                    })}
                </div>
            </div>    
            <div className="my-2 py-1 text-lg bg-neutral-100 rounded-md border grid grid-cols-3 grid-rows-4 gap-1 justify-items-center items-center">
                {/* choose type of time (order time or pickup time) */}
                <div className="row-start-2 bg-yellow-300 rounded-md px-1">類型</div>
                <select className="row-start-3 h-8 bg-white rounded-md outline-none border border-stone-500 focus:ring-2"
                    value={filter_rule.types}
                    onChange={e=>{
                        setFilterRule(draft=>{
                            draft.types = e.target.value
                        })
                    }}>
                    <option value="pickup_time">取貨</option>
                    <option value="order_time">訂購</option>
                </select>
                

                {/* choose start date */}
                <div className="col-start-2 col-span-2 bg-yellow-300 rounded-md px-1">在...日期之後</div>
                <input type="date"
                    value={filter_rule.start_time}
                    className="col-start-2 col-span-2 text-nowrap bg-white px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300"
                    onChange={(e)=>{
                        setFilterRule(draft=>{
                            draft.start_time = e.target.value
                        })
                    }}
                />                                

                {/* choose end date */}
                <div className="col-start-2 col-span-2 bg-yellow-300 rounded-md px-1">在...日期之前</div>
                <input type="date"
                    value={filter_rule.end_time}
                    className="col-start-2 col-span-2 text-nowrap bg-white px-0.5 outline-0 border border-stone-500 focus:ring-2 rounded-md hover:bg-slate-300"
                    onChange={(e)=>{
                        setFilterRule(draft=>{
                            draft.end_time = e.target.value
                        })
                    }}
                />
            </div>                            
            <button
                className="mx-auto h-10 w-full font-bold rounded-md outline-none border border-cyan-100 bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 hover:text-white"
                disabled={button_disable}
                onClick={async ()=>{
                    
                    // console.log(filter_rule)
                    setButtonText("連線中...");
                    setButtonDisable(true);
                    let response = await getOrders(filter_rule);
                    if (response.JSStatus === "Success"){
                        Swal.fire({
                            title:"獲取成功",
                            icon:"success",                            
                        })
                        setOrders(response.data);
                    }else{
                        Swal.fire({
                            title:"獲取失敗",
                            icon:"error",   
                            text:response.data,                                                        
                        })
                    }
                    setButtonDisable(false);
                    setButtonText("按下後開始篩選!");
            }}
            >{button_text}</button>            
        </>
    )
}