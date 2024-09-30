export function TextInput({handleChangeEvent, value, className="", type="text", style={}}){
    return (
        <input type={type} 
            className={className}
            value={value}
            style={style}
            onChange={e=>{handleChangeEvent(e.target.value)}}
        />
    );

}

export function Checkbox({handleChangeEvent, className=""}){
    return (
        <input type="checkbox"
            className={className}
            onChange={e=>{
                handleChangeEvent(e.target.checked)
            }}
        />
    );
}