import { useState } from "react";

export function AddButton({handleClickEvent}){
    return (
        <button className="bg-cyan-200 border-cyan-500 rounded-md w-8 font-extrabold hover:border-cyan-700 hover:bg-cyan-400"
            onClick={handleClickEvent}
        >+</button>
    );
}

export function DeleteButton({handleClickEvent}){
    return (
        <button className="bg-red-500 text-white border-red-800 rounded-md w-8 font-extrabold hover:bg-red-700 hover:border-red-300"
            onClick={handleClickEvent}
        >X</button>
    );
}


export function FinishButton({handleClickEvent}){
    return (
        <button className="bg-lime-200 rounded-md w-8 font-extrabold hover:bg-lime-500"
            onClick={handleClickEvent}
        >✓</button>
    );
}

export function ToggleButton({state, setState, type}){
    let content;
    switch (type) {
        case "editing":
            content = <button onClick={()=>{state ? setState(false) : setState(true)}}>{state ?"📁":"✏️"}</button>
            break;
        case "opening":
            content = <button onClick={()=>{state ? setState(false) : setState(true)}}>{state ? "▲" : "▼"}</button>
            break;
        default:
            content = <button>Button</button>
            break;
    }
    return content;
}


// TODO: lift the class name and content up to props
export function SubmitButton({current_page, handleClickEvent}){
    let content;

    switch (current_page) {
        case "create":
            content = <button 
                onClick={handleClickEvent}
                className="p-2 w-full text-2xl font-bold bg-yellow-300 outline-none border-4 border-yellow-100 rounded-md active:bg-yellow-500"
            >新增到資料庫</button>
            break;
        case "modify":
            content = <button                 
                onClick={()=>{
                    handleClickEvent()
                }}
                className="p-2 w-full text-2xl font-bold bg-yellow-300 outline-none border-4 border-yellow-100 rounded-md active:bg-yellow-500"
            >更新到資料庫</button>
            break;
        default:
            content = <button 
                onClick={handleClickEvent}
                className="p-2 w-full text-2xl font-bold bg-yellow-300 outline-none border-4 border-yellow-100 rounded-md active:bg-yellow-500"
            >新增</button>
            break;
    }
    return content;
}