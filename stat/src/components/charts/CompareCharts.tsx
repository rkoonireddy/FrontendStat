import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import { BlockModel } from "../../types/responseType";
import styled from "styled-components";
import { CompareLineChart } from "../charts/CompareLineChart";

const customColors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", 
  "#bcbd22", "#17becf", "#f27d7d", "#f2c0b3", "#b3e0ff", "#ffeb3b", "#e91e63", "#673ab7", 
  "#2196f3", "#4caf50", "#ff5722", "#795548"
];

const StyledBlockContainer = styled.div<{ borderColor: string }>`
  padding: 10px;
  margin: 10px;
  border: 2px solid ${(props) => props.borderColor}; /* Apply the dynamic border color */
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

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 10px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const BlocksWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  justify-content: flex-start;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const BlockIdLabel = styled(StyledLabel)`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
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
    <div>
      <BlockIdLabel>Choose features on different blocks to compare</BlockIdLabel>
      {filteredBlocks.length > 0 ? (
        <BlocksWrapper>
          {filteredBlocks.map((block: BlockModel, index) => (
            <StyledBlockContainer key={block.id} borderColor={customColors[index % customColors.length]}>
              <BlockIdLabel>{block.name}</BlockIdLabel>
              <CheckboxContainer>
                {(Object.values(block.cols_to_process) as string[]).map((filterName) => (
                  <div key={filterName} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedFilters[block.id]?.includes(filterName) || false}
                      onChange={() => handleCheckboxChange(block.id, filterName)}
                    />
                    <StyledLabel>{filterName}</StyledLabel>
                  </div>
                ))}
              </CheckboxContainer>
            </StyledBlockContainer>
          ))}
        </BlocksWrapper>
      ) : (
        <div>No available data blocks to compare at this time.</div>
      )}

      {Object.keys(selectedFilters).length > 0 && <CompareLineChart selectedFilters={selectedFilters} />}
    </div>
  );
}
