import { useImmer } from "use-immer"

import { OrderFilter} from "../Order/OrderFilter"
import { Order } from "../Order/Order"
import { OrdersTotal } from "../Order/OrdersTotal"
import { ReloadContext } from "../Order/OrderContext"

import { getOrders } from "../DBOperation/operation"
import { getTodayString } from "../Utils/dateprocessing"
import Swal from "sweetalert2"


function temp(){
	const test_data = [
		{
			"_id":"66e6861bccfd1734178ec2a6",
			"status": "unfinished",
			"item_list":[{
				  "id": 0,
				  "name": "紅龜(白豆)",
				  "amount": 0,
				  "sub_item_list":[]
			}],
			"customer_info":{
				  "name": "蘇雋勛",
				  "phone_list": [
				{
					"id": 0,
					  "number": "0982637808"
				}
			  ],
				  "order_time": "2024-09-04",
				  "pickup_time": "2024-09-15",
			},
		}
	]
	return test_data
}

const default_rule = {
	"status":"unfinished",
	"name":"",
	"phone_number":"",
	"item_list":[], // [{id:1, item_name:xxx}, ...]
	"types":"pickup_time",
	"start_time":getTodayString(), // default is today
	"end_time":"", // default is ""
}

export default function OrderModifyPage(){
    const [filter_rule, setFilterRule] = useImmer(default_rule);
    const [orders, setOrders] = useImmer([]);

	let display_content;
	if (orders.length !== 0){
		let type = filter_rule.types === "pickup_time" ? "取貨時間：" : "訂購時間："
		let content_array = []
		let prev_date = ""
		for (let i = 0; i < orders.length; i++) {
			if (prev_date != orders[i].customer_info[filter_rule.types]){
				prev_date = orders[i].customer_info[filter_rule.types]
				content_array.push(<div key={"date-" + i} className="bg-slate-200 rounded-md text-2xl p-1">{type}{prev_date}</div>)				
			}
			content_array.push(<Order key={orders[i]._id} order={orders[i]} current_page={"modify"}/>)
		}
		display_content = (
			<>
				<div className="my-1 p-1 bg-lime-300/70 rounded-md text-center text-stone-700 text-2xl font-bold">
					左右滑動
				</div>
				<div className="overflow-x-scroll snap-x snap-mandatory flex">
					
					<div className="basis-full shrink-0 snap-start snap-always px-0.5">
						{content_array.map(c=>{return c})}
					</div>					
					<div className="basis-full shrink-0 snap-start snap-always bg-sky-100 p-1">
						<OrdersTotal orders={orders} filter_rule={filter_rule}/>
					</div>
				</div>
			</>
		)
	}else{
		display_content = (
			<div className="my-1 p-1 bg-lime-300 rounded-md text-center text-stone-700 text-2xl font-bold">
				沒有訂單
			</div>			
		)
	}

	let reloadOrder = async ()=>{
		console.log("reload!")
		let response = await getOrders(filter_rule);
		if (response.JSStatus === "Success"){
			setOrders(response.data);
		}else{
			Swal.fire({
				title:"重整失敗",
				icon:"error",   
				text:response.data,                                                        
			})
		}

	}

    return(
        <div className="mx-1">
			<ReloadContext.Provider value={reloadOrder}>
				<OrderFilter filter_rule={filter_rule} setFilterRule={setFilterRule} setOrders={setOrders}/>
				{display_content}
			</ReloadContext.Provider>
        </div> 
    )
}