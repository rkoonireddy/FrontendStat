import styled from "styled-components";
import {useEffect, useState} from "react";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import {useAppSelector} from "../../hooks";
import {getActivePipelineStep, getPipeline} from "../../redux/pipelineSlice";


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
    const activeStep = useAppSelector(getActivePipelineStep);

    const [historyVisible, setHistoryVisible] = useState<boolean>(false);
    const [historyExpanded, setHistoryExpanded] = useState<boolean>(false);
    const [controlsVisible, setControlsVisible] = useState<boolean>(false);
    const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (activeStep !== undefined) {
            setHistoryVisible(activeStep.historyVisible);
            setHistoryExpanded(activeStep.historyExpanded);
            setControlsVisible(activeStep.controlsVisible);
            setControlsExpanded(activeStep.controlsExpanded);
        }
    }, [activeStep]);

    return (
        <StyledVizSectionContainer id={"viz-section"}>

            {historyVisible && (
                <>
                    {!historyExpanded &&
                        <StyledShowHideControls $marginTop={"5%"} onClick={() => setHistoryVisible(true)}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <PipelineHistorySection visible={historyExpanded}/>
                    {historyExpanded &&
                        <StyledShowHideControls onClick={() => setHistoryVisible(false)}>
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                </>
            )}

            <StyledChartContainer $controlsVisible={controlsVisible}>
                {activeStep && activeStep.type === "CSV" ? <CSVViewer/> :
                    <LineChart/>}
            </StyledChartContainer>

            {controlsVisible && (
                <>
                    {controlsExpanded &&
                        <StyledShowHideControls onClick={() => setControlsVisible(false)}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <ControlSection visible={controlsExpanded}/>
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