import styled from "styled-components";
import {VerticalSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {KnobControl} from "../controls/KnobControl";
import {InputControl} from "../controls/InputControl";
import {DropdownControl} from "../controls/DropdownControl";
import {RangeControl} from "../controls/RangeControl";


const StyledControlContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  grid-template-rows: repeat(2, minmax(150px, 1fr));
  gap: 1fr;
  height: 35%;
`;

export const StyledControl = styled.div<{ columnSpan: number, rowSpan: number }>`
  background-color: #ffffff08;
  padding: 5px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  grid-column: span ${props => props.columnSpan};
  grid-row: span ${props => props.rowSpan};
  margin: auto;
  min-width: 175px;
  min-height: 175px;
`;

export const StyledControlTitle = styled.div<{ margin?: string }>`
  font-size: 1.25rem;
  display: flex;
  justify-content: center;
  color: #ffffff;
  margin-bottom: ${props => props.margin ? props.margin : 'auto'};;
`;


export function ControlSection() {
    return (
        <StyledControlContainer id={"control-section"}>
            <VerticalSliderControl title={"Slider 1"} min={10} max={20} step={1} start={6} rowSpan={2}/>
            <FilterControl title={"Filter 1"} onLabel={"On"} offLabel={"Off"} value={true}/>
            <KnobControl title={"Control 1"} min={0} max={100} step={5} start={20}/>
            <InputControl title={"Input 1"} unit={"Hz"}/>
            <DropdownControl title={"Dropdown 1"} options={[
                {label: "Option 1", value: "OPT1"},
                {label: "Option 2", value: "OPT2"},
                {label: "Option 3", value: "OPT3"}]}/>
            <RangeControl title={"Range 1"} range={[0, 100]} />
        </StyledControlContainer>
    )
}