export function CustomerInfoReducer(draft, action){
    switch (action.type) {
        case "changeName":{
            draft.name = action.name;
            break;
        }
        case "addEmptyPhone":{
            draft.phone_list.push({"id":action.id, "number":""});
            break;
        }   
        case "changePhoneNumber":{
            let target = draft.phone_list.find(phone =>{
                return phone.id === action.id;
            });
            target.number = action.number;
            break;
        }
        case "deletePhoneNumber":{
            draft.phone_list = draft.phone_list.filter(phone=>{
                return phone.id !== action.id;
            })
            break;
        }
        case "changeOrderTime":{
            draft.order_time = action.order_time;
            break;
        }
        case "changePickupTime":{
            draft.pickup_time = action.pickup_time;
            break;
        }
        case "UpdateCustomerInfo":{
            return action.new_customer_info
        }
        default:
            throw new Error("forgetting set action !");
    }
}


export function ItemListReducer(draft, action){
    switch (action.type) {
        // Item Part
        case "AddEmptyItem":{
            draft.push({"id":action.id,"name":"", "amount":1, sub_item_list:[]});
            break;
        }
        case "deleteItem":{
            let target_id = draft.findIndex(item=>{
                return item.id === action.id;
            });
            draft.splice(target_id, 1);
            // method two
            // return draft.filter(item =>{
            //     return (item.id !== action.id);
            // });
            break;
        }
        case "changeItemName":{
            let target = draft.find(item =>{
                return item.id === action.id
            });
            target.name = action.name;
            break;
        }
        case "changeItemAmount":{
            let target = draft.find(item =>{
                return item.id === action.id
            });
            target.amount = action.amount;
            break;
        }

        // Sub Item Part
        case "addEmptySubItem":{
            let target_sub_item_list = draft.find(item =>{
                return item.id === action.id;
            }).sub_item_list;
            target_sub_item_list.push({"sub_id":action.sub_id, "sub_name":"", "sub_amount":1});
            
            break;
        }
        case "deleteSubItem":{
            let target = draft.find(item =>{
                return item.id === action.id;
            });
            target.sub_item_list = target.sub_item_list.filter(sub_item=>{
                return sub_item.sub_id !== action.sub_id;
            });
            break;
            // method 2
            // let target = draft.find(item =>{
            //     return item.id === action.id;
            // })
            // let target_sub_id = target.sub_items.findIndex(sub_item =>{
            //     return sub_item.sub_id === action.sub_id;
            // });
            // target.sub_items.splice(target_sub_id,1);
            // break;
        }
        case "changeSubItemName":{
            let target = draft.find(item =>{
                return item.id === action.id
            }).sub_item_list.find(sub_item =>{
                return sub_item.sub_id === action.sub_id
            });
            target.sub_name = action.sub_name;
            break;
        }
        case "changeSubItemAmount":{
            let target = draft.find(item =>{
                return item.id === action.id
            }).sub_item_list.find(sub_item =>{
                return sub_item.sub_id === action.sub_id
            });

            target.sub_amount = action.sub_amount;
            break;
        }
        case "UpdateItemList":{
            return action.new_item_list
        }
        default:
            throw new Error("Forget Setting Action!");
    }
}