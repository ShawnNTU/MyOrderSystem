export function OrderStatus({status, setStatus}){
    return (
        <div className="py-1 border-t border-neutral-500 grid grid-cols-2 items-center justify-items-center">
            <div>訂單狀態：</div>
            <select value={status}
                onChange={e=>{setStatus(e.target.value)}}
                className="outline-none border border-stone-500 rounded-md bg-white focus:ring-2"
            >
                <option value="finished">完成</option>
                <option value="unfinished">未完成</option>
            </select>
        </div>
    )
}