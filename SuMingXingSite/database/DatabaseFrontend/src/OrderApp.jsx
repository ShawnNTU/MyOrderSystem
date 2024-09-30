import { useState } from 'react';

import { TopNavBar } from './Component/TopNavBar';

import OrderNotifyPage from './OrderNotify/OrderNotifyPage';
import OrderCreatePage from './OrderCreate/OrderCreatePage';
import OrderModifyPage from './OrderModify/OrderModifyPage';


export default function OrderApp(){
    // three pages: create, notify, modify
    const [page, setPage] = useState("create");
    let page_content;
    switch (page) {
        case "notify":{
            page_content = <OrderNotifyPage/>
            break;
        }
        case "create":{
            page_content = <OrderCreatePage/>
            break;
        }
        case "modify":{
            page_content = <OrderModifyPage/>
            break;
        }
        default:{
            throw new Error("forgetting changing state Name !");
        }
            
    }
    return(
        <>
            <TopNavBar current_page={page} setPage={setPage} />
            {page_content}
        </>
    ) 
}

