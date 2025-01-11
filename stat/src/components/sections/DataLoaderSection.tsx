import styled from "styled-components";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import ViolinPlot from "../charts/ViolinPlot";
import DescriptiveStatistics from "../charts/DescriptiveStatistics";
import {BlockModel} from "../../types/responseType";
import {useState} from "react";
import {ToggleButton} from "../pageElements/buttons/ToggleButton";


const StyledDataLoaderSectionContainer = styled.div`
    display: block;
    height: calc(100%);
`;

const StyledSelectorContainer = styled.div<{ $height: number }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: ${(props) => props.$height + '%'};
    overflow: auto;
    flex-grow: 1;
`;

const StyledStackedChartContainer = styled.div<{ $height: number }>`
    display: flex;
    justify-content: center;
    background-color: transparent;
    width: calc(100% - 0px);
    border-radius: 10px;
    border: 2px solid #ffffff08;
    flex-grow: 1;
    margin: 2px;
    overflow: auto;
    height: ${(props) => props.$height + '%'};
`;

const StyledToggleContainer = styled.div<{ $height: number }>`
  position: absolute;
  top: 0;
`;


const StyledDataViewContainer = styled.div<{ $height: number }>`
    display: flex;
    width: 100%;
    height: ${(props) => props.$height + '%'};
    flex-direction: row;
    align-items: flex-start;
`;

const StyledMainElementContainer = styled.div`
    display: flex;
    flex-basis: 75%;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    overflow: auto;
    height: 100%;
`;

const StyledStatisticsContainer = styled.div`
    overflow: hidden;
    min-width: fit-content;
`;

export function DataLoaderSection({block}: { block: BlockModel }) {
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [statView, setStatView] = useState<boolean>(false);

    return (
        <StyledDataLoaderSectionContainer id={"dataloader-section"}>
            <StyledSelectorContainer $height={40}>
                <StyledToggleContainer $height={10}>
                <ToggleButton option1={"Table view"} option2={"Stat view"} selection={statView}
                              onSelect={setStatView}/>
                </StyledToggleContainer>
                <StyledDataViewContainer $height={90}>
                <StyledMainElementContainer>
                    {!statView ? (
                        <CSVViewer blockId={block.id} sample={5} setHoveredColumn={setHoveredColumn}/>
                    ) : (
                        <ViolinPlot setHoveredColumn={setHoveredColumn}/>
                    )}
                </StyledMainElementContainer>
                <StyledStatisticsContainer>
                    <DescriptiveStatistics column={hoveredColumn}/>
                </StyledStatisticsContainer>
                </StyledDataViewContainer>
            </StyledSelectorContainer>
            <StyledStackedChartContainer $height={60} style={{backgroundColor: '#ffffff08'}}>
                <LineChart block={block} dataLoader={true} hoveredColumn={hoveredColumn}/>
            </StyledStackedChartContainer>
        </StyledDataLoaderSectionContainer>
    );
}
