import styled from "styled-components";
import {useState} from "react";
import {Slider} from "primereact/slider";
import {StyledControl, StyledControlTitle} from "../sections/ControlSection";

const StyledSliderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;


const StyledSliderValue = styled.div`
  position: absolute;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  left: 10px;
`;


export function VerticalSliderControl({title, min, max, step, start, columnSpan = 1, rowSpan = 1}: {
    title: string,
    min: number,
    max: number,
    step: number,
    start: number,
    columnSpan?: number,
    rowSpan?: number
}) {

    const [value, setValue] = useState<number | [number, number]>(start);
    const height = 150 * rowSpan;

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <StyledControlTitle>{title}</StyledControlTitle>
            <StyledSliderContainer>
                <StyledSliderValue>{value}</StyledSliderValue>
                <Slider min={min}
                        max={max}
                        step={step}
                        value={value}
                        orientation={"vertical"}
                        style={{height: height + "px", margin: "10px 0"}}
                        onChange={(e) => setValue(e.value)}/>
            </StyledSliderContainer>
        </StyledControl>
    )
}