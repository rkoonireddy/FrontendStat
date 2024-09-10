import styled from "styled-components";
import {useEffect, useState} from "react";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    getActiveBlock,
    setBlockControlsExpanded,
    setBlockHistoryExpanded
} from "../../redux/pipelineSlice";


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
  flex-grow: 1;
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
    const dispatch = useAppDispatch();

    const [historyVisible, setHistoryVisible] = useState<boolean>(false);
    const [historyExpanded, setHistoryExpanded] = useState<boolean>(false);
    const [controlsVisible, setControlsVisible] = useState<boolean>(false);
    const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);

    useEffect(() => {
        if (activeBlock !== undefined) {
            setHistoryVisible(activeBlock.config_params.historyVisible);
            setHistoryExpanded(activeBlock.config_params.historyExpanded);
            setControlsVisible(activeBlock.config_params.controlsVisible);
            setControlsExpanded(activeBlock.config_params.controlsExpanded);
        }
    }, [activeBlock]);

    return (
        <StyledVizSectionContainer id={"viz-section"}>

            {historyVisible && (
                <>
                    {!historyExpanded &&
                        <StyledShowHideControls $marginTop={"5%"} onClick={() => dispatch(setBlockHistoryExpanded(true))}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <PipelineHistorySection show={historyExpanded}/>
                    {historyExpanded &&
                        <StyledShowHideControls onClick={() => dispatch(setBlockHistoryExpanded(false))}>
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                </>
            )}

            <StyledChartContainer $controlsVisible={controlsVisible}>
                {activeBlock && activeBlock.type === "CSVStringLoader" ? <CSVViewer/> :
                    <LineChart/>}
            </StyledChartContainer>

            {controlsVisible && (
                <>
                    {controlsExpanded &&
                        <StyledShowHideControls onClick={() => dispatch(setBlockControlsExpanded(false))}>
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                    <ControlSection show={controlsExpanded}/>
                    {!controlsExpanded &&
                        <StyledShowHideControls onClick={() => dispatch(setBlockControlsExpanded(true))}>
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                        </StyledShowHideControls>
                    }
                </>
            )}


        </StyledVizSectionContainer>
    )
}