import {useState} from "react";
import {Knob} from "primereact/knob";
import {MinusButton} from "../pageElements/buttons/MinusButton";
import {PlusButton} from "../pageElements/buttons/PlusButton";
import styled from "styled-components";
import {ControlContainer} from "./ControlContainer";


const StyledButtonControls = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 5px 5px 5px;
    margin-top: -15px;
`;

export function KnobControl({title, displayName, description, min, max, step, start, columnSpan = 1, rowSpan = 1}: {
    title: string,
    displayName: string,
    description: string,
    min: number,
    max: number,
    step: number,
    start: number,
    columnSpan?: number,
    rowSpan?: number
}) {
    const [value, setValue] = useState(start);

    function add() {
        if (value + step <= max) {
            setValue(value + step);
        } else {
            setValue(max);
        }
    }

    function subtract() {
        if (value - step >= min) {
            setValue(value - step);
        } else {
            setValue(min);
        }
    }

    return (
        <ControlContainer displayName={displayName} description={description} columnSpan={columnSpan} rowSpan={rowSpan}>
            <Knob value={value}
                  onChange={(e) => setValue(e.value)}
                  min={min}
                  max={max}
                  step={step}
                  valueColor={"#73B5B4"}
                  rangeColor={"#727272"}
                  textColor={"#ffffff"}
                  size={130}
                  readOnly/>
            <StyledButtonControls>
                <MinusButton action={() => subtract()}/>
                <PlusButton action={() => add()}/>
            </StyledButtonControls>
        </ControlContainer>
    )
}