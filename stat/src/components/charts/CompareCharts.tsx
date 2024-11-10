import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import { BlockModel } from "../../types/responseType";
import styled from "styled-components";

const StyledBlockContainer = styled.div`
  padding: 10px;
  margin: 10px;
  border: 2px solid #73B5B4;
  border-radius: 10px;
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
  min-width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const StyledLabel = styled.div`
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

// Wrapper for all blocks to ensure they are arranged in a row and scrollable if they overflow
const BlocksWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;  // Prevent wrapping the blocks to the next row
  gap: 10px;
  justify-content: flex-start;
  overflow-x: auto;  // Enable horizontal scrolling if the blocks overflow the container width
  padding-bottom: 10px; // Space at the bottom to show the scrollbar if needed
`;

const BlockIdLabel = styled(StyledLabel)`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #ffffff;
`;

export function CompareCharts() {
  const blocks = useAppSelector((state) => state.pipeline.blocks);

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
      {filteredBlocks && filteredBlocks.length > 0 ? (
        <BlocksWrapper>
          {filteredBlocks.map((block: BlockModel) => (
            <StyledBlockContainer key={block.id}>
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
        <div>Nothing here, come back again.</div>
      )}
      {/* <pre>Selected Filters: {JSON.stringify(selectedFilters, null, 2)}</pre> */}
    </div>
  );
}
