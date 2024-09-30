import { useState } from "react";

import { useItemListDispatch, useItem, useSubItem } from "./OrderHook";
import { SubItemContext } from "./OrderContext";

import { getAvailableSnippet, hasSubItems } from "./Format";

import { AddButton, DeleteButton } from "../Component/Button";
import { DropdownMenu } from "../Component/DropdownMenu";
import { TextInput } from "../Component/Input";

function SubItem(){  
    let item = useItem();
    let sub_item = useSubItem();
    let dispatch = useItemListDispatch();
    const snippet = getAvailableSnippet(item.name);

    let handleRowClickEvent = (row_value)=>{
        dispatch({
            "type":"changeSubItemName",
            "id":item.id,
            "sub_id":sub_item.sub_id,
            "sub_name":row_value
        });
    }

    let input_className = "w-12 rounded-md border border-stone-300 mx-0.5 px-0.5"
    let handleInputChange = (value)=>{dispatch({
        "type":"changeSubItemAmount",
        "id":item.id,
        "sub_id":sub_item.sub_id,
        "sub_amount":value,
    })}

    let handleClickEvent = ()=>{
        dispatch({
            "type":"deleteSubItem",
            "id":item.id,
            "sub_id":sub_item.sub_id,
        })
    }
    return (
        <li>
            {/* for sub item name */}
            <DropdownMenu display_value={sub_item.sub_name} snippet={snippet} handleRowClickEvent={handleRowClickEvent}/>
            {/* for sub amount */}
            <TextInput handleChangeEvent={handleInputChange} value={sub_item.sub_amount} className={input_className} type="number"/>
            <DeleteButton handleClickEvent={handleClickEvent}/>
        </li>
    );
}

/* ================================================================================ */

/*
sub_item_list:[ 
    { sub_id:, sub_name:, sub_amount:},
    ...
]
*/

function AddEmptySubItem(){
    let item = useItem();
    let dispatch = useItemListDispatch();
    let sub_item_list = item.sub_item_list;

    const [id, setID] = useState(sub_item_list.length)

    let handleClickEvent = ()=>{
        dispatch({
            "type":"addEmptySubItem",
            "id":item.id,
            "sub_id":id,
        });
        setID(id + 1)
    }

    return (
        hasSubItems(item.name) && (
            <li>            
                <span className="mr-1">細項內容</span>
                { <AddButton handleClickEvent={handleClickEvent} />}                
            </li>
        )
    );
}


export function SubItemList({sub_item_list}){
    return (
        <ul className="ml-4 list-inside list-disc">
            <AddEmptySubItem />
            {sub_item_list.map(sub_item=>{ return (
                <SubItemContext.Provider key={sub_item.sub_id} value={sub_item}>
                    <SubItem />
                </SubItemContext.Provider>
            );})}            
        </ul>
    );
}
