import styled from "styled-components";
import {useState} from "react";
import {Slider} from "primereact/slider";
import {StyledControl} from "../sections/ControlSection";
import {ControlTitle} from "./ControlTitle";

const StyledRangeContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: auto;
`;


const StyledRangeValue = styled.div<{$left: boolean}>`
  position: absolute;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  left: ${props => props.$left? '10px' : ''};
  right: ${props => !props.$left? '10px' : ''};
  bottom: -50px;
`;


export function RangeControl({title, range, columnSpan = 2, rowSpan = 1}: {
    title: string,
    range: [number, number],
    columnSpan?: number,
    rowSpan?: number
}) {

    const [value, setValue] = useState<[number, number]>(range);
    const width = 175 * columnSpan;

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'}/>
            <StyledRangeContainer>
                <StyledRangeValue $left={true}>{value[0]}</StyledRangeValue>
                <Slider value={value}
                        orientation={"horizontal"}
                        style={{width: width + "px", margin: "auto 10px"}}
                        onChange={(e) => setValue(e.value as [number, number])}
                        range/>
                <StyledRangeValue $left={false}>{value[1]}</StyledRangeValue>
            </StyledRangeContainer>
        </StyledControl>
    )
}