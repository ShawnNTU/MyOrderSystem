import { useState } from "react";
import { ToggleButton } from "./Button";

export function DropdownMenu({display_value, snippet, handleRowClickEvent}){
    const [open, setOpen] = useState(false);
    const [search_input, setSearchInput] = useState("");

    return (
        <>
            <div className="inline-block my-1 px-1 relative border-stone-500 border rounded-md"
                onClick={()=>{!open && setOpen(true)}}
            >
                {display_value === "" ? "請點我選擇" : display_value}
                {open && 
                    <>
                        {/* this component is for closing the dropmenu when click "outside the dropmenu" */}
                        <div className="fixed left-0 top-0 w-screen h-screen"
                            onClick={()=>{open && setOpen(false)}}
                        ></div>
                        {/* dropdown menu */}
                        <div className={"absolute left-0 top-8 z-10 max-w-60 max-h-60 overflow-y-scroll overflow-x-hidden bg-white border border-stone-300 shadow-lg"} 
                            onBlur={()=>{ open?setOpen(false):setOpen(true)}}
                        >
                        {/* search bar */}
                        <input type="text" className="sticky top-0 shadow-lg border border-neutral-300"
                            placeholder="輸入名稱可以篩選"
                            value={search_input}
                            onChange={(e)=>{setSearchInput(e.target.value)}}
                        />
                        {/* rows of search result */}
                        {snippet.map(x =>{
                            if (x.includes(search_input)){
                                return (
                                    <div key={x} className="border-b border-stone-300 p-1 text-left hover:bg-neutral-300 hover:cursor-pointer" 
                                        onClick={()=>{handleRowClickEvent(x)}}>{x}</div>
                                )
                            }
                        })}
                        </div>
                    </>
                }
                <ToggleButton state={open} setState={setOpen} type={"opening"} />
            </div>            
        </>
    );
}