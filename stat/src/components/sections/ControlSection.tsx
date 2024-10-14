import styled from "styled-components";
import {VerticalIntegerSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {InputControlString, InputControlInt, InputControlFloat} from "../controls/InputControl";
import {DropdownControl} from "../controls/DropdownControl";
import {RangeControl} from "../controls/RangeControl";
import {addControl, fetchUpdateBlock, getActiveBlock, getControls, getPipelineModel} from "../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
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
    const pipeline = useAppSelector(getPipelineModel);
    const activeBlock = useAppSelector(getActiveBlock);
    const controls = useAppSelector(getControls);
    const [filterComponents, setFilterComponents] = useState<JSX.Element[]>([]);
    const [blockFilters, setBlockFilters] = useState<{ [key: string]: string }>({});
    const dispatch = useAppDispatch();

    useEffect(() => {
        setFilterComponents([]);
        if (activeBlock && activeBlock.filters && Object.keys(activeBlock.filters).length > 0) {
            const components: JSX.Element[] = [];
            let blockControls: { [key: string]: any } = {};
            Object.entries(activeBlock.filters).forEach(([key, filter]) => {

                // If the activeBlock has a value for field <key>, use it. Otherwise use the default from the filter or undefined if nothing is set
                const activeBlockFilterValue = activeBlock[key as keyof typeof activeBlock] ?? filter.default;
                blockControls[key] = activeBlockFilterValue;
                
                switch (filter.filter_type) {
                    case "boolean":
                        components.push(<FilterControl key={filter.name} title={filter.name} onLabel={"On"}
                                                       offLabel={"Off"} value={blockControls[key]}/>);
                        break;
                    case "input_str":
                        components.push(<InputControlString key={filter.name} title={filter.name} initialValue={blockControls[key]}/>);
                        break;
                    case "input_int":
                        components.push(<InputControlInt key={filter.name} title={filter.name} initialValue={blockControls[key]}/>);
                        break;
                    case "input_float":
                        components.push(<InputControlFloat key={filter.name} title={filter.name} initialValue={blockControls[key]}/>);
                        break;
                    case "singleselect":
                        components.push(<DropdownControl key={filter.name} title={filter.name}
                                                         options={filter.options.map((option: any) => {
                                                             return {label: option, value: option};
                                                         })}
                                                         defaultValue={blockControls[key]}/>);                           
                        break;
                    case "multiselect":
                        components.push(<MultiSelectControl key={filter.name} title={filter.name}
                                                            options={filter.options.map((option: any) => {
                                                                return {label: option, value: option};
                                                            })}
                                                            defaultValues={blockControls[key]}/>);
                        break;
                    case "slider":
                        components.push(<VerticalIntegerSliderControl
                            key={filter.name}
                            title={filter.name}
                            min={filter.min}
                            max={filter.max}
                            step={1}
                            start={blockControls[key]}/>
                        );
                        break;
                    case "range_int":
                        components.push(<RangeControl
                            key={filter.name}
                            title={filter.name}
                            range={[filter.min, filter.max]}
                            initial_range={[blockControls[key][0], blockControls[key][1]]}
                            step={1}/>
                        );
                        break;
                    case "range_float":
                        components.push(<RangeControl
                            key={filter.name}
                            title={filter.name}
                            range={[filter.min, filter.max]}
                            initial_range={[blockControls[key][0], blockControls[key][1]]}
                            step={filter.step}
                            />
                        );
                        break;
                    default:
                        break;
                }
            });
            setFilterComponents(components);
            dispatch(addControl({blockId: activeBlock.id, filters: blockControls}));
            setBlockFilters(blockControls);
        }
    }, [activeBlock]);

    function applyFilters() {
        if (activeBlock) {
            dispatch(fetchUpdateBlock({pipelineId: pipeline.id, blockId: activeBlock.id, filters: controls[activeBlock.id]})).then(() => {
                console.log("Filters applied");
            })
        }
    }


    return (
        <StyledControls $show={show}>
            <StyledControlContainer id={"control-section"} $rowNumber={1}>
                {filterComponents}
            </StyledControlContainer>
            <PrimaryButton size={150} text={"Apply"} action={() => applyFilters()}/>
        </StyledControls>
    )
}