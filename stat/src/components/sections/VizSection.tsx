import styled from "styled-components";
import {useEffect, useState} from "react";
import {ControlSection} from "./ControlSection";
import {ReactComponent as DownSVG} from "../../assets/caret-down-fill.svg";
import {ReactComponent as RightSVG} from "../../assets/caret-right-fill.svg";
import {ReactComponent as UpSVG} from "../../assets/caret-up-fill.svg";
import {PipelineHistorySection} from "./PipelineHistorySection";
import {DataLoaderSection} from "./DataLoaderSection";
import {LineChart} from "../charts/LineChart";
import {useAppDispatch} from "../../hooks";
import {
    setBlockControlsExpanded,
    setBlockHistoryExpanded,
} from "../../redux/pipelineSlice";
import {BlockModel} from "../../types/responseType";
import {CompareCharts} from "./CompareCharts";
import {ToggleButton} from "../pageElements/buttons/ToggleButton";

const StyledVizSectionContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #ffffff08;
    height: calc(100vh - 15px);
    margin: 5px;
`;

const StyledChartContainer = styled.div<{ $controlsVisible: boolean }>`
    display: flex;
    justify-content: center;
    background-color: #ffffff08;
    padding: 5px;
    width: calc(100% - 10px);
    height: ${(props) =>
            props.$controlsVisible ? 'calc(100% - 80px)' : 'calc(100% - 30px)'};
    border-radius: 15px;
    flex-grow: 1;
    margin: auto;
    flex-direction: column;
    position: relative;
`;

const StyledShowHideControls = styled.div<{ $marginTop?: string; $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.$isExpanded ? '#73b5b4' : '#73b5b4')};
  justify-content: center;
  height: 25px;
  opacity: ${(props) => (props.$isExpanded ? '0.25' : '0.8')};
  margin-left: 10px;
  width: calc(100% - 20px);
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '10px')};
  position: ${(props) => (props.$marginTop ? 'absolute' : 'relative')};

    &:hover {
        cursor: pointer;
        opacity: 1;
    }
`;

export function VizSection({block}: { block: BlockModel }) {
    const dispatch = useAppDispatch();

    const [historyVisible, setHistoryVisible] = useState<boolean>(true);
    const [historyExpanded, setHistoryExpanded] = useState<boolean>(true);
    const [controlsVisible, setControlsVisible] = useState<boolean>(false);
    const [controlsExpanded, setControlsExpanded] = useState<boolean>(false);
    const [isCompareMode, setIsCompareMode] = useState(false);

    useEffect(() => {
        setHistoryVisible(block.config_params.historyVisible);
        setHistoryExpanded(block.config_params.historyExpanded);
        setControlsVisible(block.config_params.controlsVisible);
        setControlsExpanded(block.config_params.controlsExpanded);
    }, [block]);

    return (
        <StyledVizSectionContainer id="viz-section">
            {historyVisible && (
                <>
                    {!historyExpanded && (
                        <StyledShowHideControls
                            onClick={() => dispatch(setBlockHistoryExpanded(true))}
                            $isExpanded={historyExpanded}
                        >
                            <RightSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                            <span style={{color: "#ffffff"}}>View the pipeline history</span>
                        </StyledShowHideControls>
                    )}
                    <PipelineHistorySection show={historyExpanded}/>
                    {historyExpanded && (
                        <StyledShowHideControls
                            onClick={() => dispatch(setBlockHistoryExpanded(false))}
                            $isExpanded={historyExpanded}
                        >
                            <UpSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                            <span style={{color: "#ffffff"}}>Pipeline History</span>
                        </StyledShowHideControls>
                    )}
                </>
            )}

            {block.type !== "CSVStringLoader" &&
                <div style={{display: "flex", alignContent: "flex-start", flexWrap: "wrap"}}>
                    <ToggleButton option1={"Visualize"} option2={"Compare"} selection={isCompareMode} onSelect={setIsCompareMode} />
                </div>}

            <StyledChartContainer $controlsVisible={controlsVisible}>
            {block.type === "CSVStringLoader" ? (
                <DataLoaderSection block={block} />
            ) : (
                isCompareMode ? (
                    <>
                        <CompareCharts />
                    </>
                ) : (
                    <LineChart block={block} />
                )
            )}
            </StyledChartContainer>

            {controlsVisible && (
                <>
                    {controlsExpanded && (
                        <StyledShowHideControls
                            onClick={() => dispatch(setBlockControlsExpanded(false))}
                            $isExpanded={controlsExpanded}
                        >
                            <DownSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                            <span style={{color: "#ffffff"}}>The controls</span>
                        </StyledShowHideControls>
                    )}
                    <ControlSection show={controlsExpanded}/>
                    {!controlsExpanded && (
                        <StyledShowHideControls
                            onClick={() => dispatch(setBlockControlsExpanded(true))}
                            $isExpanded={controlsExpanded}
                        >
                            <RightSVG style={{width: "25px", height: "25px", color: "#ffffff"}}/>
                            <span style={{color: "#ffffff"}}>View the controls</span>
                        </StyledShowHideControls>
                    )}
                </>
            )}
        </StyledVizSectionContainer>
    );
}
