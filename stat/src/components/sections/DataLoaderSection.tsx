import styled from "styled-components";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import BoxPlot from "../charts/BoxPlot";
import ViolinPlot from "../charts/ViolinPlot";
import DescriptiveStatistics from "../charts/DescriptiveStatistics";
import {BlockModel} from "../../types/responseType";
import {useState} from "react";
import {ToggleButton} from "../pageElements/ToggleButton";


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

const StyledToggleContainer = styled.div`
    position: absolute;
    top: 0;
`;


const StyledDataViewContainer = styled.div`
    display: flex;
    width: 100%;
    margin: auto 0 15px 0;
`;

const StyledMainElementContainer = styled.div`
    width: 65%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    overflow: auto;
`;

const StyledStatisticsContainer = styled.div`
    flex-basis: 30%;
    overflow: none;
`;

export function DataLoaderSection({block}: { block: BlockModel }) {
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [statView, setStatView] = useState<boolean>(false);

    return (
        <StyledDataLoaderSectionContainer id={"dataloader-section"}>
            <StyledSelectorContainer $height={40}>
                <StyledToggleContainer>
                <ToggleButton option1={"Table view"} option2={"Stat view"} selection={statView}
                              onSelect={setStatView}/>
                </StyledToggleContainer>
                <StyledDataViewContainer>
                <StyledMainElementContainer>
                    {!statView ? (
                        <CSVViewer blockId={block.id} sample={5} setHoveredColumn={setHoveredColumn}/>
                    ) : (
                        <ViolinPlot/>
                    )}
                </StyledMainElementContainer>
                <StyledStatisticsContainer>
                    <DescriptiveStatistics column={hoveredColumn}/>
                </StyledStatisticsContainer>
                </StyledDataViewContainer>
            </StyledSelectorContainer>
            <StyledStackedChartContainer $height={60} style={{backgroundColor: '#ffffff08'}}>
                <LineChart block={block} dataLoader={true}/>
            </StyledStackedChartContainer>
        </StyledDataLoaderSectionContainer>
    );
}
