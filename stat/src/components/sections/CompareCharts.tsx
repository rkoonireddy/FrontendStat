import React, {useEffect} from "react";
import {useAppSelector, useAppDispatch} from "../../hooks";
import {BlockModel} from "../../types/responseType";
import styled from "styled-components";
import {CompareLineChart} from "../charts/CompareLineChart";
import {COLOR_PALETTE} from "../../Theme";
import {HorizontalScrollContainer} from "../pageElements/HorizontalScrollContainer";
import { setBlocks, setSelectedOpacity, initializeSelectedFilters, setSelectedFilters, setSelectedColor} from "../../redux/compareChartSlice";
import { RootState } from "../../store";
import { ReactComponent as ColorPickerSVG } from "../../assets/palette.svg";
import {setActiveBlockId, getActiveBlock} from "../../redux/pipelineSlice";
import {Slider} from "primereact/slider";

const StyledBlocksContainer = styled.div`
    position: absolute;
    margin: 10px auto auto auto;
    inset: 0;
    display: flex;
    flex-direction: column;
`;

const StyledBlockLineSelectorContainer = styled.div<{ $borderColor: string }>`
    position: relative;
    padding: 10px;
    margin: 10px;
    border: 2px solid ${(props) => props.$borderColor}; /* Apply the dynamic border color */
    border-radius: 10px;
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
    min-width: 200px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    cursor:pointer;
`;

const StyledLabel = styled.div<{ $absolute?: boolean }>`
    font-size: 0.75rem;
    font-weight: normal;
    color: #ffffff;
    margin-left: 5px;
    
    ${(props) => props.$absolute && `
        position: absolute;
        right: 0;
        left: 0;
        margin: 0 auto 15px auto;
    `}
`;

const StyledCheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const StyledBlockIdLabel = styled(StyledLabel)`
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
`;

const StyledRunBlockMsg = styled.div`
    font-size: 0.65rem;
    color: #ffffff;
    font-style: italic;
`;

const StyledBlockContent = styled.div`
    font-size: 0.75rem;
    font-weight: lighter;
    color: #73B5B4;
    margin-left: 5px;
`;

const StyledBlockSubHead = styled.div`
    font-size: 0.75rem;
    font-weight: lighter;
    color: white;
    padding-bottom: 5px;
    margin-left: 5px;
    text-decoration: underline;
    text-decoration-color: #ccc;
    text-decoration-thickness: 2px;
`;

const StyledColorPickerContainer = styled.div`
    position: absolute;
    right: -12px;
    top: -12px;
`;

const StyledOpacitySliderContainer = styled.div`
    position: relative;
    display: flex; 
    align-items: center; 
    gap: 2px;
    
    & .p-slider .p-slider-handle {
        width: 1rem;
        height: 1rem;
    }
`;

export function CompareCharts() {
    const dispatch = useAppDispatch();
    const activeBlock = useAppSelector(getActiveBlock);
    const blocks = useAppSelector((state: RootState) => state.compareCharts.blocks) || [];
    const selectedFilters = useAppSelector((state: RootState) => state.compareCharts.selectedFilters);
    const pipelineBlocks = useAppSelector((state: RootState) => state.pipeline.blocks);
    const selectedColors = useAppSelector((state) => state.compareCharts.selectedColors);
    const selectedOpacity = useAppSelector(state => state.compareCharts.selectedOpacity);

    useEffect(() => {
        if (pipelineBlocks.length > 0) {
            dispatch(setBlocks(pipelineBlocks));
            dispatch(initializeSelectedFilters());
        }
    }, [pipelineBlocks, dispatch]);

    const handleCheckboxChange = (blockId: string, filterName: string) => {
        const currentFilters = selectedFilters[blockId] || [];
        const isSelected = currentFilters.includes(filterName);

        const updatedFilters = isSelected
            ? currentFilters.filter((f) => f !== filterName)
            : [...currentFilters, filterName];

        dispatch(setSelectedFilters({ blockId, filters: updatedFilters }));
    };

    const handleColorChange = (blockId: string, color: string) => {
        console.log(blockId);
        dispatch(setSelectedColor({ blockId, color }));
    };
    
    const handleOpacityChange = (blockId: string, opacity: number) => {
        dispatch(setSelectedOpacity({ blockId, opacity: opacity }));
    };

    const handleBlockSelect = (blockId: string) => {
        dispatch(setActiveBlockId(blockId));
    };

    const filteredBlocks = blocks.filter((block) => block.type !== "CSVStringLoader");
           
    return (
        <StyledBlocksContainer>
            <StyledBlockIdLabel>Choose features on different blocks to compare</StyledBlockIdLabel>
            {filteredBlocks.length > 0 ? (
                <HorizontalScrollContainer id={"compare-charts"}>
                    {filteredBlocks.map((block: BlockModel, index) => {
                        const filterKeys = Object.keys(block.filters).filter(key => key !== "cols_to_process");
                        const blockColor = selectedColors[block.id] || COLOR_PALETTE[index % COLOR_PALETTE.length];
                        const blockOpacity = selectedOpacity[block.id] ?? 100; // Default opacity to 100 if not set. Be careful, 0 is a valid value.
                        const rgbaColor = `rgba(${parseInt(blockColor.slice(1, 3), 16)}, 
                                               ${parseInt(blockColor.slice(3, 5), 16)}, 
                                               ${parseInt(blockColor.slice(5, 7), 16)}, 
                                               ${blockOpacity / 100})`;
    
                        return (
                                <StyledBlockLineSelectorContainer
                                    key={block.id}
                                    $borderColor={blockColor}
                                    style={{ backgroundColor: rgbaColor }}
                                    onClick={(e) => {
                                        const target = e.target as HTMLElement;
                                        if (target.tagName !== 'INPUT') {
                                            handleBlockSelect(block.id);
                                        }
                                    }}
                                >
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: '5px', width: '100%' }}>
                                    <div>
                                        <StyledBlockIdLabel>{block.name}</StyledBlockIdLabel>
                                    </div>
                                    <StyledOpacitySliderContainer>
                                        <StyledLabel>Opacity</StyledLabel>
                                        <StyledLabel $absolute={true}>{blockOpacity}%
                                        </StyledLabel>
                                        <Slider min={0}
                                                max={100}
                                                step={1}
                                                value={blockOpacity}
                                                orientation={"horizontal"}
                                                style={{width: "100px", cursor: 'pointer', marginRight: '20px'}}
                                                onChange={(e) => handleOpacityChange(block.id, e.value as number)}/>
                                        <StyledColorPickerContainer>
                                            <label
                                                htmlFor="color-picker"
                                                style={{ color: 'white', fontSize: '0.75rem', position: 'relative' }}
                                            >
                                                <ColorPickerSVG
                                                    style={{
                                                        borderLeft: '20px',
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer',
                                                        fill: blockColor,
                                                    }}
                                                />
                                                <input
                                                    id="color-picker"
                                                    type="color"
                                                    value={blockColor}
                                                    onChange={(e) => {
                                                        handleColorChange(block.id, e.target.value); // Handle color change
                                                        handleBlockSelect(block.id); // Explicitly select the block
                                                    }}
                                                    style={{ width: 0, height: 0, opacity: 0 }}
                                                />
                                            </label>
                                        </StyledColorPickerContainer>
                                    </StyledOpacitySliderContainer>
                                </div>
                                <StyledBlockContent>{block.type}</StyledBlockContent>
                                <StyledCheckboxContainer>
                                    {block.cols_to_process ? (
                                        <>
                                            <div>
                                                <StyledBlockSubHead>Features</StyledBlockSubHead>
                                                {(Object.values(block.cols_to_process) as string[]).map(featureName => (
                                                    <div key={featureName}
                                                         style={{display: 'flex', alignItems: 'center'}}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFilters[block.id]?.includes(featureName) || false}
                                                            onChange={() => handleCheckboxChange(block.id, featureName)}
                                                        />
                                                        <StyledLabel style={{ color: 'white' }}>{featureName}</StyledLabel>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr style={{ margin: '0px 0', border: '1px solid #ccc' }} />
                                            <div style={{ alignItems: 'center' }}>
                                                <StyledBlockSubHead>Filters</StyledBlockSubHead>
                                                {filterKeys.length > 0 ? (
                                                    <ul style={{ margin: 0, padding: '0 0 0 20px', textAlign: 'left', color: '#73B5B4' }}>
                                                        {filterKeys.map(filterKey => {
                                                            const filterValue = block[filterKey as keyof BlockModel];
                                                            return (
                                                                <li key={filterKey} style={{ listStyleType: 'disc', marginBottom: '5px' }}>
                                                                    <StyledBlockContent>
                                                                        {filterKey}: {JSON.stringify(filterValue)}
                                                                    </StyledBlockContent>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <StyledBlockContent>--- No filters applied ---</StyledBlockContent>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <StyledRunBlockMsg>Run block to see available columns</StyledRunBlockMsg>
                                    )}
                                </StyledCheckboxContainer>
                            </StyledBlockLineSelectorContainer>
                        );
                    })}
                </HorizontalScrollContainer>
            ) : (
                <div>No available data blocks to compare at this time.</div>
            )}
    
            {Object.keys(selectedFilters).length > 0 && (
                <CompareLineChart selectedFilters={selectedFilters} selectedColors={selectedColors} selectedOpacity={selectedOpacity}/>
            )}
        </StyledBlocksContainer>
    );
}