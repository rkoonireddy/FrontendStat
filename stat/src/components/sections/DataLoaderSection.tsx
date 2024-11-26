import styled from "styled-components";
import { LineChart } from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import BoxPlot from "../charts/BoxPlot";
//import { useAppDispatch } from "../../hooks";
import { BlockModel } from "../../types/responseType";
import {useState, useEffect} from "react";


const StyledDataLoaderSectionContainer = styled.div`
  display: block;
  height: calc(100%);
`;

const SelectorContainer = styled.div<{ $height: number }>`
  display: flex;
  align-items: center;
  height: calc(${(props) => props.$height + '% - 0px'});
  overflow: auto;
`;

const StyledStackedChartContainer = styled.div<{ $height: number }>`
  display: flex;
  justify-content: center;
  background-color: transparent;
  width: calc(100% - 0px);
  height: calc(${(props) => props.$height + '% - 0px'});
  border-radius: 10px;
  border: 2px solid #ffffff08;
  flex-grow: 1;
  margin: 2px;
  overflow: auto;
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

export function DataLoaderSection({ block }: { block: BlockModel }) {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [view, setView] = useState<'CSVViewer' | 'BoxPlot'>('BoxPlot');

  const toggleView = () => {
    setView((prevView) => (prevView === 'CSVViewer' ? 'BoxPlot' : 'CSVViewer'));
  };

    return (
      <StyledDataLoaderSectionContainer id={"dataloader-section"}>
      <SelectorContainer $height={30}>
        <StyledButton onClick={toggleView}>
          {view === 'CSVViewer' ? 'BoxPlot' : 'Table'}
        </StyledButton>
        {view === 'CSVViewer' ? (
            <CSVViewer blockId={block.id} sample={5} hoveredColumn={hoveredColumn} setHoveredColumn={setHoveredColumn} />
          ) : (
            <BoxPlot blockId={block.id}/>
          )}
      </SelectorContainer>
        <StyledStackedChartContainer $height={70} style={{ backgroundColor: '#ffffff08' }}>
          <LineChart block={block} dataLoader={true} />
        </StyledStackedChartContainer>
      </StyledDataLoaderSectionContainer>
    );
  }
  