import { useState } from "react";

import { useItem, useItemListDispatch } from "./OrderHook";

import { ItemContext } from "./OrderContext";

import { SubItemList } from "./SubItemList";

import { getAvailableSnippet } from "./Format";

import { AddButton, DeleteButton } from "../Component/Button";
import { DropdownMenu } from "../Component/DropdownMenu";
import { TextInput } from "../Component/Input";


function Item(){
    let item = useItem();
    let dispatch = useItemListDispatch();

    const snippet = getAvailableSnippet("")

    let handleRowClickEvent = (row_value)=>{
        dispatch({
            "type":"changeItemName",
            "id":item.id,
            "name":row_value
        });
    }

    let input_className = "w-12 rounded-md border border-stone-300 mx-0.5 px-0.5"
    let handleInputChangeEvent = (value)=>{
        dispatch({
            "type":"changeItemAmount",
            "id":item.id,
            "amount":value
        })
    }

    let handleButtonClickEvent = ()=>{
        dispatch({
            "type":"deleteItem",
            "id":item.id,
        });
    }
    return (
        <ul className="ml-4 list-disc list-inside">
            <li>
                {/* for item name */}
                <DropdownMenu display_value={item.name} snippet={snippet} handleRowClickEvent={handleRowClickEvent} />
                {/* for item amount */}
                <TextInput handleChangeEvent={handleInputChangeEvent} value={item.amount} className={input_className} type="number"/>
                <DeleteButton handleClickEvent={handleButtonClickEvent} />
            </li>
            <SubItemList sub_item_list={item.sub_item_list} />           
        </ul>
    );
}


/* ================================================================================ */

/*
item_list:[ 
    { id:, name:, amount:, sub_item_list:[]},
    ...
]
*/

function AddEmptyItem({item_list}){
    let dispatch = useItemListDispatch();

    const [id, setID] = useState(item_list.length)
    let handleClickEvent = ()=>{
        dispatch({
            "type":"AddEmptyItem",
            "id":id
        });  
        setID(id + 1);
    }
    return (
        <div className="flex items-center justify-center space-x-4">
            <div>訂單內容</div>
            <AddButton handleClickEvent={handleClickEvent} />
        </div> 
    )
}

export function ItemList({item_list}){
    
    return (
        <div className="py-1 flex flex-col">
            <AddEmptyItem item_list={item_list}/>
            {item_list.map(item =>{return(
                <ItemContext.Provider key={item.id} value={item}>
                    <Item />
                </ItemContext.Provider>
            )})}       
        </div>
    )
}