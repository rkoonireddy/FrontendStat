import styled from "styled-components";
import {useEffect, useState} from "react";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import {useAppSelector} from "../../hooks";
import {getActiveBlock, getPipeline} from "../../redux/pipelineSlice";


const StyledVizSectionContainer = styled.div`
  position: relative;
  display: flex;
  background-color: #ffffff08;
  height: calc(100vh - 10px);
  margin: 5px;
  flex-direction: column;
`;

const StyledChartContainer = styled.div<{ $controlsVisible: boolean }>`
  display: flex;
  justify-content: center;
  margin: 10px;
  background-color: #ffffff08;
  padding: 5px;
  width: calc(100% - 20px);
  height: calc(${props => props.$controlsVisible ? '65%' : '100%'} - 30px);
  border-radius: 15px;
`;

const StyledShowHideControls = styled.div<{ $marginTop?: string }>`
  display: flex;
  justify-content: center;
  height: 25px;
  opacity: 0.25;
  margin-left: 10px;
  background-color: #ffffff08;
  width: calc(100% - 20px);
  margin-top: ${props => props.$marginTop ? props.$marginTop : '0'};
  position: ${props => props.$marginTop ? 'absolute' : 'relative'};

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;


export function VizSection() {
    const activeBlock = useAppSelector(getActiveBlock);

    const [historyVisible, setHistoryVisible] = useState<boolean>(true);
    const [historyExpanded, setHistoryExpanded] = useState<boolean>(true);
    const [controlsVisible, setControlsVisible] = useState<boolean>(true);
    const [controlsExpanded, setControlsExpanded] = useState<boolean>(true);

    useEffect(() => {
        if (activeBlock !== undefined) {
            // TODO: when block model contains these values set them
            // setHistoryVisible(activeBlock.historyVisible);
            // setHistoryExpanded(activeBlock.historyExpanded);
            // setControlsVisible(activeBlock.controlsVisible);
            // setControlsExpanded(activeBlock.controlsExpanded);
        }
    }, [activeBlock]);

    return (
        <StyledVizSectionContainer id={"viz-section"}>

            {historyVisible && (
                <>
                    {!historyExpanded &&
                        <StyledShowHideControls $marginTop={"5%"} onClick={() => setHistoryVisible(true)}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <PipelineHistorySection show={historyExpanded}/>
                    {historyExpanded &&
                        <StyledShowHideControls onClick={() => setHistoryVisible(false)}>
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                </>
            )}

            <StyledChartContainer $controlsVisible={controlsVisible}>
                {activeBlock && activeBlock.type === "CSV" ? <CSVViewer/> :
                    <LineChart/>}
            </StyledChartContainer>

            {controlsVisible && (
                <>
                    {controlsExpanded &&
                        <StyledShowHideControls onClick={() => setControlsVisible(false)}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <ControlSection show={controlsExpanded}/>
                    {!controlsExpanded &&
                        <StyledShowHideControls onClick={() => setControlsVisible(true)}>
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                </>
            )}


        </StyledVizSectionContainer>
    )
}