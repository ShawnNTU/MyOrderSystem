export function TopNavBar({current_page, setPage}){

    function handlePageChange(target_page, current_page){
        target_page !== current_page && setPage(target_page);
    }
    let normal = "rounded-md leading-[3rem]  hover:bg-green-950 active:bg-lime-200 active:text-stone-600 cursor-pointer"
    let current = "rounded-md leading-[3rem] bg-lime-200 text-stone-600 hover:bg-green-950 hover:text-white active:bg-lime-200 active:text-stone-600 cursor-pointer"
    return (
        <div className="grid grid-cols-3 h-12 bg-green-800 text-white text-xl font-bold text-center align-middle">
            <div className={current_page === "notify" ? current : normal} onClick={()=>{handlePageChange("notify", current_page)}}>通知</div>
            <div className={current_page === "create" ? current : normal} onClick={()=>{handlePageChange("create", current_page)}}>新增</div>
            <div className={current_page === "modify" ? current : normal} onClick={()=>{handlePageChange("modify", current_page)}}>編輯</div>
        </div>
    );
}