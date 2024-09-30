import { Fragment } from "react";


export function OrdersTotal({orders, filter_rule}){
    let total = {}
    for (let i = 0; i < orders.length; i++) {
        let item_list = orders[i].item_list
        for (let j = 0; j < item_list.length; j++) {
            if (total[item_list[j].name] === undefined){
                total[item_list[j].name] = item_list[j].amount;
            }else{
                total[item_list[j].name] += item_list[j].amount;
            }
            // check sub items
            if (item_list[j].sub_item_list !== undefined){
                let sub_item_list = item_list[j].sub_item_list
                for (let k = 0; k < sub_item_list.length; k++) {
                    if (total[sub_item_list[k].sub_name] === undefined){
                        total[sub_item_list[k].sub_name] = sub_item_list[k].sub_amount;
                    }else{
                        total[sub_item_list[k].sub_name] += sub_item_list[k].sub_amount;
                    }
                }
            }
        }
    }

    let items = Object.entries(total);
    

    return (
        <>
            <div className="bg-amber-50 py-1 my-1 rounded-md text-center text-xl whitespace-pre">
                {getFilterInformation(filter_rule)}
            </div>
            <div className="grid grid-cols-2 justify-center text-center text-2xl border-2 border-neutral-400 bg-stone-100 rounded-md">
                <div className="py-1 border-b-2 border-stone-400">名稱</div>
                <div className="py-1 border-b-2 border-stone-400">數量</div>
                {items.map(([item_name, item_amount], index)=>{ return (
                    <Fragment key={index}>
                        <div className={"py-0.5 border-t-2 border-stone-200 " + (((index%2) === 0) && "bg-white")}>{item_name}</div>
                        <div className={"py-0.5 border-t-2 border-stone-200 " + (((index%2) === 0) && "bg-white")}>{item_amount}</div>
                    </Fragment>)
                })}
            </div>
        </>
    );
}

function getFilterInformation(filter_rule){
    let log;
    let type;
    filter_rule.status === "pickup_timeup" ? type="取貨時間": type="訂購時間"
    let status;
    filter_rule.status === "unfinished" ? status="未完成" : status="完成"

    if (filter_rule.start_time !== "" && filter_rule.end_time !== ""){
        log = `${type}介於 ${filter_rule.start_time} 跟 ${filter_rule.end_time} 之間的\n${status}訂單的統計`
    }else if (filter_rule.start_time !== ""){
        log = `${type}在 ${filter_rule.start_time} 之後\n的${status}訂單的統計`
    }else if (filter_rule.end_time !== ""){
        log = `${type}在 ${filter_rule.end_time} 之前\n的${status}訂單的統計`
    }else{
        log = `${status}的訂單的統計`
    }
    return log
}