import styled from "styled-components";
import { LineChart } from "../charts/LineChart";
import CSVViewer from "../charts/CSVViewer";
//import { useAppDispatch } from "../../hooks";
import { BlockModel } from "../../types/responseType";
import { StyledShowHideControls } from "./VizSection";
import { ReactComponent as DownSVG } from "../../assets/caret-down-fill.svg";
import { ReactComponent as UpSVG } from "../../assets/caret-up-fill.svg";

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
  const [tableExpanded, setTableExpanded] = useState<boolean>(false);

  /*useEffect(() => {
    setTableExpanded(block.config_params.controlsExpanded);
  }, [block]);*/

  return (
    <StyledDataLoaderSectionContainer id={"dataloader-section"}>
      {!tableExpanded && (
        <StyledShowHideControls //onClick={() => dispatch(setTableExpanded(true))}
          onClick={() => setTableExpanded(true)}
          $isExpanded={tableExpanded}>
          <DownSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
          <span style={{ color: "#ffffff" }}>Feature Selector</span>
        </StyledShowHideControls>
      )}
      {tableExpanded && (
        <StyledStackedChartContainer $height={30}>
          <CSVViewer blockId={block.id} sample={4} />
        </StyledStackedChartContainer>
      )}
      {tableExpanded && (
        <StyledShowHideControls //onClick={() => dispatch(setTableExpanded(false))}
          //$marginTop="10px" -> this will work only if the position is relative, not absolute
          onClick={() => setTableExpanded(false)}
          $isExpanded={tableExpanded}>
          <UpSVG style={{ width: "25px", height: "25px", color: "#ffffff" }} />
          <span style={{ color: "#ffffff" }}>Feature Selector</span>
        </StyledShowHideControls>
      )}
      <StyledStackedChartContainer $height={70}>
        <LineChart block={block} dataLoader={true} />
      </StyledStackedChartContainer>
    </StyledDataLoaderSectionContainer>
  );
}
