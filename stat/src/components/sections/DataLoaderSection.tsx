import styled from "styled-components";
import { useEffect, useState } from "react";
import { LineChart } from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
//import { useAppDispatch } from "../../hooks";
import { BlockModel } from "../../types/responseType";

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
    //const dispatch = useAppDispatch();
    useEffect(() => {
        //dispatch();
    }, [block]);
  
    return (
      <StyledDataLoaderSectionContainer id={"dataloader-section"}>
        <StyledStackedChartContainer $height={30}>
            <CSVViewer blockId={block.id} sample={4}/>
        </StyledStackedChartContainer>
        <StyledStackedChartContainer $height={70}>
            <LineChart block={block} dataLoader={true}/>
        </StyledStackedChartContainer>
      </StyledDataLoaderSectionContainer>
    );
  }
  