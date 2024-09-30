import { useContext } from "react";
import { 
    CustomerInfoContext,
    CustomerInfoDispatchContext,
    ItemContext,
    SubItemContext,
    ItemListDispatchContext,
    CounterContext,
    SetCounterContext,
    ReloadContext,
} from "./OrderContext";

export function useCutomerInfoDispatch(){
    return useContext(CustomerInfoDispatchContext);
}

export function useCutomerInfo(){
    return useContext(CustomerInfoContext);
}


export function useItem(){
    return useContext(ItemContext);
}

export function useSubItem(){
    return useContext(SubItemContext);
}

export function useItemListDispatch(){
    return useContext(ItemListDispatchContext);
}

export function useCounter(){
    return useContext(CounterContext)
}

export function useSetCounter(){
    return useContext(SetCounterContext)
}

export function useReloadContext(){
    return useContext(ReloadContext)
}