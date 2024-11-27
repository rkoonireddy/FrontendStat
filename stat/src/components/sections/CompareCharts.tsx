import React, {useState} from "react";
import {useAppSelector} from "../../hooks";
import {BlockModel} from "../../types/responseType";
import styled from "styled-components";
import {CompareLineChart} from "../charts/CompareLineChart";
import {COLOR_PALETTE} from "../../Theme";
import {HorizontalScrollContainer} from "../pageElements/HorizontalScrollContainer";

const StyledBlocksContainer = styled.div`
    position: absolute;
    margin: 10px auto auto auto;
    inset: 0;
    display: flex;
    flex-direction: column;
`;

const StyledBlockLineSelectorContainer = styled.div<{ $borderColor: string }>`
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
`;

const StyledLabel = styled.div`
    font-size: 0.75rem;
    font-weight: normal;
    color: #73B5B4;
    margin-left: 5px;
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

export function CompareCharts() {
    const blocks = useAppSelector((state) => state.pipeline.blocks) || []; // Fallback to empty array if undefined
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

    const handleCheckboxChange = (blockId: string, filterName: string) => {
        setSelectedFilters((prevSelected) => {
            const currentFilters = prevSelected[blockId] || [];
            const isSelected = currentFilters.includes(filterName);

            const updatedFilters = isSelected
                ? currentFilters.filter((f) => f !== filterName)
                : [...currentFilters, filterName];

            return {
                ...prevSelected,
                [blockId]: updatedFilters,
            };
        });
    };

    const filteredBlocks = blocks.filter((block) => block.type !== "CSVStringLoader");

    return (
        <StyledBlocksContainer>
            <StyledBlockIdLabel>Choose features on different blocks to compare</StyledBlockIdLabel>
            {filteredBlocks.length > 0 ? (
                <HorizontalScrollContainer id={"compare-charts"}>
                    {filteredBlocks.map((block: BlockModel, index) => (
                        <StyledBlockLineSelectorContainer key={block.id}
                                                          $borderColor={COLOR_PALETTE[index % COLOR_PALETTE.length]}>
                            <StyledBlockIdLabel>{block.name}</StyledBlockIdLabel>
                            <StyledCheckboxContainer>
                                {block.cols_to_process ?
                                (Object.values(block.cols_to_process) as string[]).map((filterName) => (
                                    <div key={filterName} style={{display: 'flex', alignItems: 'center'}}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[block.id]?.includes(filterName) || false}
                                            onChange={() => handleCheckboxChange(block.id, filterName)}
                                        />
                                        <StyledLabel>{filterName}</StyledLabel>
                                    </div>
                                )) : <StyledRunBlockMsg> Run block to see available columns </StyledRunBlockMsg>}
                            </StyledCheckboxContainer>
                        </StyledBlockLineSelectorContainer>
                    ))}
                </HorizontalScrollContainer>
            ) : (
                <div>No available data blocks to compare at this time.</div>
            )}

            {Object.keys(selectedFilters).length > 0 && <CompareLineChart selectedFilters={selectedFilters}/>}
        </StyledBlocksContainer>
    );
}
