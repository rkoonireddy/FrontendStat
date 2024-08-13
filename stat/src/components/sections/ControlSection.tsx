import styled from "styled-components";
import {useState} from "react";
import {Knob} from "primereact/knob";
import {PlusButton} from "../buttons/PlusButton";
import {MinusButton} from "../buttons/MinusButton";


const StyledControlContainer = styled.div`
  display: flex;
  height: 50%;
`;

const StyledControl = styled.div`
  margin: 10px;
  width: 150px;
  height: 150px;
  background-color: #ffffff08;
  padding: 5px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledControlTitle = styled.div`
    font-size: 1.25rem;
    display: flex;
    justify-content: center;
    color: #ffffff;
    
`;

const StyledButtonControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5px 5px 5px;
  margin-top: -15px;
`;

export function KnobControl({title, min, max, step, start}: { title: string, min: number, max: number, step: number, start: number }) {
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
        <StyledControl>
            <StyledControlTitle>{title}</StyledControlTitle>
            <Knob value={value}
                  onChange={(e) => setValue(e.value)}
                  min={min}
                  max={max}
                  step={step}
                  valueColor={"#73B5B4"}
                  rangeColor={"#727272"}
                  textColor={"#ffffff"}
                  size={110}
                  readOnly/>
            <StyledButtonControls>
                <MinusButton action={() => subtract()}/>
                <PlusButton action={() => add()}/>
            </StyledButtonControls>
        </StyledControl>
    )

}


export function ControlSection() {
    return (
        <StyledControlContainer id={"control-section"}>
            <StyledControl>Control 1</StyledControl>
            <StyledControl>Control 2</StyledControl>
            <KnobControl title={"Control 1"} min={0} max={100} step={5} start={20}/>
            <KnobControl title={"Control 2"} min={0} max={10} step={2} start={6}/>
        </StyledControlContainer>
    )
}