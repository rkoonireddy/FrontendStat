import styled from "styled-components";
import {VerticalSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {KnobControl} from "../controls/KnobControl";
import {InputControl} from "../controls/InputControl";
import {DropdownControl} from "../controls/DropdownControl";
import {RangeControl} from "../controls/RangeControl";
import {getActiveBlock} from "../../redux/pipelineSlice";
import {useAppSelector} from "../../hooks";
import {useEffect} from "react";


const StyledControlContainer = styled.div<{ $show: boolean, $columnNumber?: number, $rowNumber?: number }>`
  display: ${props => (props.$show ? "grid" : "none")};
  grid-template-columns: repeat(${props => props.$columnNumber ?? 4}, minmax(150px, 1fr));
  grid-template-rows: repeat(${props => props.$rowNumber ?? 2}, minmax(150px, 1fr));
  gap: 1fr;
  height: fit-content;
  max-height: 35%;
`;

export const StyledControl = styled.div<{ $columnSpan: number, $rowSpan: number }>`
  background-color: #ffffff08;
  padding: 5px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  grid-column: span ${props => props.$columnSpan};
  grid-row: span ${props => props.$rowSpan};
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


export function ControlSection({show}: { show: boolean }) {
    const activeBlock = useAppSelector(getActiveBlock);
    const filterComponents: JSX.Element[] = [];

    useEffect(() => {
        if (activeBlock && Array.isArray(activeBlock.filters)) {
            activeBlock.filters.map((filter) => {
                switch (filter.type) {
                    case "BooleanFilter":
                        filterComponents.push(<FilterControl title={filter.name} onLabel={"On"} offLabel={"Off"}
                                                             value={true}/>);
                        break;
                    case "InputFilter":
                        filterComponents.push(<InputControl title={filter.name} unit={"Hz"}/>);
                        break;
                    case "SingleSelectFilter":
                        filterComponents.push(<DropdownControl title={filter.name}
                                                               options={filter.options.map((option: any) => {
                                                                   return {label: option, value: option}
                                                               })}/>);
                        break;
                    case "MultiSelectFilter":
                        filterComponents.push(<DropdownControl title={filter.name}
                                                               options={filter.options.map((option: any) => {
                                                                   return {label: option, value: option}
                                                               })}/>);
                        break;
                    case "SliderInteger":
                        filterComponents.push(<VerticalSliderControl title={filter.name} min={filter.min} max={filter.max}
                                                                    step={filter.step} start={filter.start}/>);
                        break;
                    case "SliderFloat":
                        filterComponents.push(<KnobControl title={filter.name} min={filter.min} max={filter.max}
                                                          step={filter.step} start={filter.start}/>);
                        break;
                    case "RangeInteger":
                        filterComponents.push(<RangeControl title={filter.name} range={[filter.min, filter.max]}/>);
                        break;
                    case "RangeFloat":
                        filterComponents.push(<RangeControl title={filter.name} range={[filter.min, filter.max]}/>);
                        break;
                    default:
                        break;
                }
            })
        }
    }, [activeBlock]);


    return (
        <StyledControlContainer id={"control-section"} $show={show} $rowNumber={1}>
            {/*{activeBlock && activeBlock.type === "CSVStringLoader" ?*/}
            {/*    <InputControl title={"Frequency"} unit={"Hz"}/> :*/}
            {/*    <>*/}
            {/*        <VerticalSliderControl title={"Slider 1"} min={10} max={20} step={1} start={6} rowSpan={2}/>*/}
            {/*        <FilterControl title={"Filter 1"} onLabel={"On"} offLabel={"Off"} value={true}/>*/}
            {/*        <KnobControl title={"Control 1"} min={0} max={100} step={5} start={20}/>*/}
            {/*        <InputControl title={"Input 1"} unit={"Hz"}/>*/}
            {/*        <DropdownControl title={"Dropdown 1"} options={[*/}
            {/*            {label: "Option 1", value: "OPT1"},*/}
            {/*            {label: "Option 2", value: "OPT2"},*/}
            {/*            {label: "Option 3", value: "OPT3"}]}/>*/}
            {/*        <RangeControl title={"Range 1"} range={[0, 100]}/>*/}
            {/*    </>}*/}
            {filterComponents}
        </StyledControlContainer>
    )
}