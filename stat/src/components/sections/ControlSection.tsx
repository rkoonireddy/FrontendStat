import styled from "styled-components";
import {VerticalSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {KnobControl} from "../controls/KnobControl";
import {InputControl} from "../controls/InputControl";


const StyledControlContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  grid-template-rows: repeat(2, minmax(150px, 1fr));
  gap: 1fr;  
  height: 30%;
`;

export const StyledControl = styled.div<{columnSpan: number, rowSpan: number}>`
  background-color: #ffffff08;
  padding: 5px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  grid-column: span ${props => props.columnSpan};
  grid-row: span ${props => props.rowSpan};
  margin: auto;
  min-width: 150px;
  min-height: 150px;
`;

export const StyledControlTitle = styled.div<{ margin?: string}>`
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  margin-bottom: ${props => props.margin? props.margin: 'auto'};;
`;



export function ControlSection() {
    return (
        <StyledControlContainer id={"control-section"}>
            <VerticalSliderControl title={"Slider 1"} min={10} max={20} step={1} start={6} rowSpan={2}/>
            <FilterControl title={"Filter 1"} onLabel={"On"} offLabel={"Off"} value={true}/>
            <KnobControl title={"Control 1"} min={0} max={100} step={5} start={20}/>
            <KnobControl title={"Control 2"} min={0} max={10} step={2} start={6}/>
            <InputControl title={"Input 1"} unit={"Hz"}/>
        </StyledControlContainer>
    )
}