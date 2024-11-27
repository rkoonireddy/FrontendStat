import styled from "styled-components";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import BoxPlot from "../charts/BoxPlot";
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
            <StyledSelectorContainer $height={30}>
                <ToggleButton option1={"Table view"} option2={"Stat view"} selection={statView}
                              onSelect={setStatView}/>
                <StyledDataViewContainer>
                <StyledMainElementContainer>
                    {!statView ? (
                        <CSVViewer blockId={block.id} sample={5} setHoveredColumn={setHoveredColumn}/>
                    ) : (
                        <BoxPlot blockId={block.id} setHoveredColumn={setHoveredColumn}/>
                    )}
                </StyledMainElementContainer>
                <StyledStatisticsContainer>
                    <DescriptiveStatistics column={hoveredColumn}/>
                </StyledStatisticsContainer>
                </StyledDataViewContainer>
            </StyledSelectorContainer>
            <StyledStackedChartContainer $height={70} style={{backgroundColor: '#ffffff08'}}>
                <LineChart block={block} dataLoader={true}/>
            </StyledStackedChartContainer>
        </StyledDataLoaderSectionContainer>
    );
}
