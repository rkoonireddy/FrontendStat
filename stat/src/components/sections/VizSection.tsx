import styled from "styled-components";
import {useEffect, useState} from "react";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";
import {LineChart} from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import {useAppDispatch} from "../../hooks";
import {
    setBlockControlsExpanded,
    setBlockHistoryExpanded
} from "../../redux/pipelineSlice";
import {BlockModel} from "../../types/responseType";


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


export function VizSection({block}: { block: BlockModel}) {
    const dispatch = useAppDispatch();

    const [historyVisible, setHistoryVisible] = useState<boolean>(false);
    const [historyExpanded, setHistoryExpanded] = useState<boolean>(false);
    const [controlsVisible, setControlsVisible] = useState<boolean>(false);
    const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);

    useEffect(() => {
            setHistoryVisible(block.config_params.historyVisible);
            setHistoryExpanded(block.config_params.historyExpanded);
            setControlsVisible(block.config_params.controlsVisible);
            setControlsExpanded(block.config_params.controlsExpanded);
    }, [block]);

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
                {block.type === "CSVStringLoader" ? <CSVViewer blockId={block.id}/> :
                    <LineChart block={block}/>}
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