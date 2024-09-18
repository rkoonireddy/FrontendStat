import styled from "styled-components";
import {VerticalSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {KnobControl} from "../controls/KnobControl";
import {InputControl} from "../controls/InputControl";
import {DropdownControl} from "../controls/DropdownControl";
import {RangeControl} from "../controls/RangeControl";
import {getActiveBlock} from "../../redux/pipelineSlice";
import {useAppSelector} from "../../hooks";
import {useEffect, useState} from "react";
import {MultiSelectControl} from "../controls/MultiSelectControl";
import {PrimaryButton} from "../buttons/PrimaryButton";

const StyledControls = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? "flex" : "none")};
  flex-direction: column;
  height: fit-content;
  max-height: 35%;
`;

const StyledControlContainer = styled.div<{ $columnNumber?: number, $rowNumber?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columnNumber ?? 4}, minmax(150px, 1fr));
  grid-template-rows: repeat(${props => props.$rowNumber ?? 2}, minmax(150px, 1fr));
  gap: 1fr;
  height: fit-content;
  margin-bottom: 10px;
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

export function ControlSection({show}: { show: boolean }) {
    const activeBlock = useAppSelector(getActiveBlock);
    const [filterComponents, setFilterComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setFilterComponents([]);
        if (activeBlock && activeBlock.filters && Object.keys(activeBlock.filters).length > 0) {
            const components: JSX.Element[] = [];
            Object.entries(activeBlock.filters).forEach(([key, filter]) => {
                switch (filter.filter_type) {
                    case "boolean":
                        components.push(<FilterControl key={filter.name} title={filter.name} onLabel={"On"}
                                                       offLabel={"Off"} value={true}/>);
                        break;
                    case "input":
                        components.push(<InputControl key={filter.name} title={filter.name} unit={"Hz"}/>);
                        break;
                    case "singleselect":
                        components.push(<DropdownControl key={filter.name} title={filter.name}
                                                         options={filter.options.map((option: any) => {
                                                             return {label: option, value: option};
                                                         })}/>);
                        break;
                    case "multiselect":
                        components.push(<MultiSelectControl key={filter.name} title={filter.name}
                                                            options={filter.options.map((option: any) => {
                                                                return {label: option, value: option};
                                                            })}/>);
                        break;
                    case "slider":
                        components.push(<VerticalSliderControl key={filter.name} title={filter.name} min={filter.min}
                                                               max={filter.max} step={filter.step}
                                                               start={filter.start}/>);
                        break;
                    case "range":
                        components.push(<RangeControl key={filter.name} title={filter.name}
                                                      range={[filter.min, filter.max]}/>);
                        break;
                    default:
                        break;
                }
            });
            setFilterComponents(components);
        }
    }, [activeBlock]);


    return (
        <StyledControls $show={show}>
            <StyledControlContainer id={"control-section"} $rowNumber={1}>
                {filterComponents}
            </StyledControlContainer>
            <PrimaryButton size={150} text={"Apply"} action={() => console.log("Apply button clicked")}/>
        </StyledControls>
    )
}