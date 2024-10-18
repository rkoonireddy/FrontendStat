import styled from "styled-components";
import { useEffect, useState } from "react";
import { ControlSection } from "./ControlSection";
import { ReactComponent as DownSVG } from "../../assets/caret-down-fill.svg";
import { ReactComponent as RightSVG } from "../../assets/caret-right-fill.svg";
import { ReactComponent as UpSVG } from "../../assets/caret-up-fill.svg";
import { PipelineHistorySection } from "./PipelineHistorySection";
import { LineChart } from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
import { useAppDispatch } from "../../hooks";
import {
  setBlockControlsExpanded,
  setBlockHistoryExpanded,
} from "../../redux/pipelineSlice";
import { BlockModel } from "../../types/responseType";

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
  width: calc(100% - 20px);
  height: ${(props) =>
    props.$controlsVisible ? 'calc(100% - 80px)' : 'calc(100% - 30px)'}; 
  border-radius: 15px;
  flex-grow: 1;
  margin: auto;
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

export function VizSection({ block }: { block: BlockModel }) {
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
          {!historyExpanded && (
            <StyledShowHideControls 
              onClick={() => dispatch(setBlockHistoryExpanded(true))}
              $isExpanded={historyExpanded} // Pass the state here
            >
              <RightSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>View the pipeline history</span>
            </StyledShowHideControls>
          )}
          <PipelineHistorySection show={historyExpanded} />
          {historyExpanded && (
            <StyledShowHideControls 
              onClick={() => dispatch(setBlockHistoryExpanded(false))}
              $isExpanded={historyExpanded} // Pass the state here
            >
              <UpSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>Pipeline History</span>
            </StyledShowHideControls>
          )}
        </>
      )}

      <StyledChartContainer $controlsVisible={controlsVisible}>
        {block.type === "CSVStringLoader" ? <CSVViewer blockId={block.id} /> : <LineChart block={block} />}
      </StyledChartContainer>

      {controlsVisible && (
        <>
          {controlsExpanded && (
            <StyledShowHideControls 
              onClick={() => dispatch(setBlockControlsExpanded(false))}
              $isExpanded={controlsExpanded} // Pass the state here
            >
              <DownSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>The controls</span>
            </StyledShowHideControls>
          )}
          <ControlSection show={controlsExpanded} />
          {!controlsExpanded && (
            <StyledShowHideControls 
              onClick={() => dispatch(setBlockControlsExpanded(true))}
              $isExpanded={controlsExpanded} // Pass the state here
            >
              <RightSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>View the controls</span>
            </StyledShowHideControls>
          )}
        </>
      )}
    </StyledVizSectionContainer>
  );
}
