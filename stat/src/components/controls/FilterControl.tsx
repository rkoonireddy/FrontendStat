import {useState} from "react";
import {InputSwitch} from "primereact/inputswitch";
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";

export function FilterControl({title, onLabel, offLabel, value, columnSpan = 1, rowSpan = 1}: {
    title: string,
    onLabel: string,
    offLabel: string,
    value: boolean,
    columnSpan?: number,
    rowSpan?: number
}) {
    const [filterValue, setFilterValue] = useState(value);
    const [label, setLabel] = useState(filterValue ? onLabel : offLabel);

    function toggle() {
        setFilterValue(!filterValue);
        setLabel(filterValue ? offLabel : onLabel);
    }

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} />
            <InputSwitch id={"input switch"}
                         checked={filterValue}
                         name={label}
                         onChange={toggle}/>
        </StyledControl>
    )
}