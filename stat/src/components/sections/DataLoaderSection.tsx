import styled from "styled-components";
import { LineChart } from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import BoxPlot from "../charts/BoxPlot";
//import { useAppDispatch } from "../../hooks";
import { BlockModel } from "../../types/responseType";
import {useState, useEffect} from "react";

const StyledDataLoaderSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff08;
  height: calc(100vh - 0px);
  width: calc(100% - 0px);
  padding: 5px;
`;

const StyledStackedChartContainer = styled.div<{ $height: number }>`
  display: flex;
  justify-content: center;
  background-color: #ffffff08;
  width: calc(100% - 0px);
  height: calc(${(props) => props.$height + '% - 0px'});
  border-radius: 15px;
  border: 2px solid #ffffff08;
  flex-grow: 1;
  margin: 5px;
  overflow: auto;
`;


export function DataLoaderSection({ block }: { block: BlockModel }) {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

    return (
      <StyledDataLoaderSectionContainer id={"dataloader-section"}>
        <StyledStackedChartContainer $height={30}>
            <CSVViewer blockId={block.id} sample={4} hoveredColumn={hoveredColumn} setHoveredColumn={setHoveredColumn}/>
            <BoxPlot blockId={block.id} hoveredColumn={hoveredColumn}/>
        </StyledStackedChartContainer>
        <StyledStackedChartContainer $height={70}>
            <LineChart block={block} dataLoader={true}/>
        </StyledStackedChartContainer>
      </StyledDataLoaderSectionContainer>
    );
  }
  