import { useImmer } from "use-immer"

import { TextInput, Checkbox } from "../Component/Input";
import { getOrders } from "../DBOperation/operation";

export function OrderFilter({setFilterRule, setOrders}){
    
    let init_rules = {
        "start_time":"",
        "end_time":"",
        "status":"finished",
        "types":"pickup_time"
    }

    let init_checked_rule = {
        "start_time":false,
        "end_time":false,
        "status":false,
        "types":false,
    }

    const [rules, setRules] = useImmer(init_rules);
    const [checked_rule, setCheckedRule] = useImmer(init_checked_rule);

    return (
        <div className="my-2 py-1 text-lg bg-neutral-100 rounded-md border grid grid-cols-2 gap-2 justify-items-center">
            <p className="col-span-2">請選擇篩選條件，選擇好後記得勾啟用</p>
            {/* choose order status */}
            <div className="flex gap-x-1 items-center">
                <Checkbox handleChangeEvent={value=>{setCheckedRule(draft=>{draft.status = value});}} className="h-6 w-6"/>
                <span className="bg-yellow-300 rounded-md px-1">狀態</span>
                <select className="h-8 bg-white rounded-md outline-none border border-stone-500 focus:ring-2"
                    onChange={e=>{
                        setRules(draft=>{
                            draft.status = e.target.value;
                        })
                    }}>
                    <option value="finished">完成</option>
                    <option value="unfinished">未完成</option>
                </select>
            </div>

            {/* choose type of time (order time or pickup time) */}
            <div className="flex gap-x-1 items-center">
                <Checkbox handleChangeEvent={value=>{setCheckedRule(draft=>{draft.types = value});}} className="h-6 w-6"/>
                <span className="bg-yellow-300 rounded-md px-1">類型</span>
                <select className="h-8 bg-white rounded-md outline-none border border-stone-500 focus:ring-2"
                    onChange={e=>{
                    setRules(draft=>{
                            draft.types = e.target.value
                        })
                    }}>
                    <option value="pickup_time">取貨</option>
                    <option value="order_time">訂購</option>
                </select>
            </div>

            {/* choose start date */}
            <div>
                <div className="flex justify-around gap-x-1">
                    <Checkbox handleChangeEvent={value=>{setCheckedRule(draft=>{draft.start_time = value});}} className="h-6 w-6"/>
                    <span>在...日期之後</span>
                </div>
                <TextInput handleChangeEvent={value=>{setRules(draft=>{draft.start_time=value})}}
                    className="h-8 w-32 bg-white rounded-md outline-none border border-stone-500 focus:ring-2" 
                    value={rules.start_time} type="date"/>
            </div>

            {/* choose end date */}
            <div>
                <div className="flex justify-around gap-x-1">
                    <Checkbox handleChangeEvent={value=>{setCheckedRule(draft=>{draft.end_time = value});}} className="h-6 w-6"/>
                    <span>在...日期之前</span>
                </div>
                <TextInput handleChangeEvent={value=>{setRules(draft=>{draft.end_time=value})}} 
                    className="h-8 w-32 bg-white rounded-md outline-none border border-stone-500 focus:ring-2"
                    value={rules.end_time} type="date" />
            </div>
                        
            <button
                className="col-span-2 mx-auto h-10 w-3/4 font-bold rounded-md outline-none border border-cyan-100 bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 hover:text-white"
                onClick={async ()=>{
                    let used_rules = {
                        "start_time":"",
                        "end_time":"",
                        "status":"",
                        "types":""
                    }
                    used_rules.status = checked_rule.status ? rules.status : "unfinished"
                    used_rules.types = checked_rule.types ? rules.types : "pickup_time"
                    used_rules.start_time = checked_rule.start_time ? rules.start_time : ""
                    used_rules.end_time = checked_rule.end_time ? rules.end_time : ""
                    // console.log(used_rules)
                    let filtered_orders = await getOrders(used_rules);
                    setOrders(filtered_orders)
                    setFilterRule(used_rules);
            }}
            >按下後開始篩選!</button>
        </div>
    )
}