import { 
    CustomerInfoContext,
    CustomerInfoDispatchContext,
    CounterContext,
    SetCounterContext,
} from "./OrderContext";

export function CustomerInfoProvider({context, dispatch, children}){
    return(
        <CustomerInfoContext.Provider value={context}>
            <CustomerInfoDispatchContext.Provider value={dispatch}>
                {children}
            </CustomerInfoDispatchContext.Provider>
        </CustomerInfoContext.Provider>
    );
}

export function CounterProvider({counter, setCounter, children}){
    return (
        <CounterContext.Provider value={counter}>
            <SetCounterContext.Provider value={setCounter}>
                {children}
            </SetCounterContext.Provider>
        </CounterContext.Provider>
    );
}