import { useEffect } from "react"
import { useImmer } from "use-immer"

import { Order } from "../Order/Order"
import { OrdersTotal } from "../Order/OrdersTotal"
import { ReloadContext } from "../Order/OrderContext"

import { getOrders } from "../DBOperation/operation"
import Swal from "sweetalert2"

export default function OrderNotification(){
    const filter_rule = {
        "start_time":"",
        "end_time":"",
        "status":"unfinished",
        "types":"pickup_time"
    }
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
				content_array.push(<Order key={orders[i]._id} order={orders[i]} current_page={"modify"}/>)
			}else{
				content_array.push(<Order key={orders[i]._id} order={orders[i]} current_page={"modify"}/>)
			}
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
		let filtered_orders = await getOrders(filter_rule);
		console.log("reload!", filtered_orders)
		setOrders(filtered_orders);
	}

    useEffect(()=>{
        reloadOrder()
    }, [])

	let mypromise = ()=>{
		return new Promise((resolve)=>{
			setTimeout(()=>{resolve("Time out!")}, 1000)
		})
	}

	let click = ()=>{
		Swal.fire({
			title:"this is title",
			showConfirmButton:true,
			confirmButtonText:"Confirm !",
			showLoaderOnConfirm:true,
			showCancelButton:true,
			showCloseButton:true,
			showDenyButton:true,
			preConfirm:async()=>{
				
				let res = await mypromise()
				return res
			}
		}).then((result=>{
			if (result.isConfirmed){
				Swal.fire(result.value)
			}else if (result.isDenied){
				Swal.close("Close")
			}else if (result.isDismissed){
				console.log(result)
				Swal.fire(result.dismiss.toString())
			}
		})).then(res=>{
			console.log(res)
		})
	}

	console.log("Render!")

    return(
        <div className="mx-1">
			<ReloadContext.Provider value={reloadOrder}>
				{display_content}
			</ReloadContext.Provider>
        </div> 
    )
}