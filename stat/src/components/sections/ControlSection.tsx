import styled from "styled-components";
import {VerticalIntegerSliderControl} from "../controls/SliderControl";
import {FilterControl} from "../controls/FilterControl";
import {InputControl} from "../controls/InputControl";
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
`;

const StyledControlContainer = styled.div<{ $columnNumber?: number, $rowNumber?: number }>`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
    height: fit-content;
    margin-top: 15px;
    margin-bottom: 15px;
`;

export const StyledControl = styled.div<{ $columnSpan: number, $rowSpan: number }>`
    position: relative;
    background-color: #ffffff12;
    padding: 5px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    grid-column: span ${props => props.$columnSpan};
    grid-row: span ${props => props.$rowSpan};
    margin: 2px auto;
    min-width: 175px;
    min-height: 125px;
`;

export function ControlSection({show}: { show: boolean }) {
    const pipeline = useAppSelector(getPipelineModel);
    const activeBlock = useAppSelector(getActiveBlock);
    const controls = useAppSelector(getControls);
    const [filterComponents, setFilterComponents] = useState<JSX.Element[]>([]);
    const dispatch = useAppDispatch();
    const [applyReady, setApplyReady] = useState(true);

    useEffect(() => {
        setFilterComponents([]);

        console.log("activeBlock changed 1");

        if (activeBlock && activeBlock.filters && Object.keys(activeBlock.filters).length > 0) {
            
            console.log("activeBlock changed 2 with activeBlock:");
            console.log(activeBlock);

            const components: JSX.Element[] = [];
            let blockControls: { [key: string]: any } = {};
            Object.entries(activeBlock.filters).forEach(([key, filter]) => {

                // To force rerendering, generate truly unique key as combination of block id and filter name
                let unique_key = `${activeBlock.id}-${filter.name}`;
                console.log(`unique key: ${unique_key}`);

                // If the activeBlock has a value for field <key>, use it. Otherwise use the default from the filter or undefined if nothing is set
                blockControls[key] = activeBlock[key as keyof typeof activeBlock] ?? filter.default;

                // If the filter provides a label, use it. Otherwise use the name
                let filter_display_name = filter.label ?? filter.name;

                switch (filter.filter_type) {
                    case "boolean":
                        components.push(<FilterControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            onLabel={"On"}
                            offLabel={"Off"}
                            value={blockControls[key]}/>
                        );
                        break;
                    case "input_str":
                        components.push(<InputControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            initialValue={blockControls[key]}
                            validate={filter.nullable ?
                                (value) => true : // If nullable, any string is valid
                                (value) => value !== undefined // If not nullable (default from backend), don't allow empty strings
                            }
                            convert={(value)=>value}
                            invalidMessage={filter.nullable ? "Enter string or blank for null" : "Enter string"}
                            onChange={setApplyReady}/>
                        );
                        break;
                    case "input_int":
                        components.push(<InputControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            initialValue={blockControls[key]}
                            validate={filter.nullable ?
                                (value) => value === undefined || Number.isInteger(Number(value)) :
                                (value) => value !== "" && Number.isInteger(Number(value))
                            }
                            convert={(value)=>Number(value)}
                            invalidMessage={filter.nullable ? "Enter valid integer or blank for null" : "Enter valid integer"}
                            onChange={setApplyReady}/>
                        );
                        break;
                    case "input_float":

                        // console.log("input_float detected");
                        // console.log(`Using initial value ${blockControls[key]}`);
                        // console.log("The filter is");
                        // console.log(filter);

                        components.push(<InputControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            initialValue={blockControls[key]}
                            validate={filter.nullable ?
                                (value) => value === undefined || !isNaN(Number(value)) :
                                (value) => value !== "" && !isNaN(Number(value))
                            }
                            convert={(value)=>Number(value)}
                            invalidMessage={filter.nullable ? "Enter valid float or blank for null" : "Enter valid float"}
                            onChange={setApplyReady}/>
                        );
                        break;
                    case "singleselect":
                        components.push(<DropdownControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            options={filter.options.map((option: any) => {return {label: option, value: option};})}
                            defaultValue={blockControls[key]}/>
                        );
                        break;
                    case "multiselect":
                        components.push(<MultiSelectControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            options={filter.options.map((option: any) => {return {label: option, value: option};})}
                            defaultValues={blockControls[key]}/>
                        );
                        break;
                    case "slider":
                        components.push(<VerticalIntegerSliderControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            min={filter.min}
                            max={filter.max}
                            step={1}
                            start={blockControls[key]}/>
                        );
                        break;
                    case "range_int":
                        components.push(<RangeControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            range={[filter.min, filter.max]}
                            initial_range={[blockControls[key][0], blockControls[key][1]]}
                            step={1}/>
                        );
                        break;
                    case "range_float":
                        components.push(<RangeControl
                            key={unique_key}
                            title={filter.name}
                            displayName={filter_display_name}
                            range={[filter.min, filter.max]}
                            initial_range={[blockControls[key][0], blockControls[key][1]]}
                            step={filter.step}/>
                        );
                        break;
                    default:
                        break;
                }
            });
            setFilterComponents(components);
            dispatch(addControl({blockId: activeBlock.id, filters: blockControls}));
        }
    }, [activeBlock]);

    function applyFilters() {
        if (activeBlock) {

            dispatch(fetchUpdateBlock({
                pipelineId: pipeline.id,
                blockId: activeBlock.id,
                filters: controls[activeBlock.id]
            }))
                .unwrap()
                .then(() => {
                    console.log("Filters applied");
                })
                .catch((err) => {
                    console.log("Failed to apply filters");
                });
        }
    }


    return (
        <StyledControls $show={show}>
            <StyledControlContainer id={"control-section"} $rowNumber={1}>
                {filterComponents}
            </StyledControlContainer>
            <PrimaryButton size={150} text={"Apply"} action={() => applyFilters()} disabled={!applyReady}/>
        </StyledControls>
    )
}