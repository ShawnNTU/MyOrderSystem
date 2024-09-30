function test({handleClickOutside}){
    return(
        <div className="fixed left-0 top-0 w-screen h-screen bg-black/50"
            onClick={handleClickOutside}
        >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-300 w-1/2 h-[25vh]"
                onClick={(e)=>{
                    e.stopPropagation()
                }}
            >
                content
            </div>
        </div>
    )
}