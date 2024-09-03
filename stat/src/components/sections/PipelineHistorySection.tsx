import styled from "styled-components";

const StyledPipelineHistorySection = styled.div<{ $historyVisible: boolean }>`
  display:flex;
  justify-content: left;
  margin: 0 10px;
  background-color: #ffffff08;
  padding: 5px;
  width: calc(100% - 20px);
  height: ${props => props.$historyVisible ? 'calc(35% - 30px)' : '5%'};
  opacity: ${props => props.$historyVisible ? '1' : '0.25'};
  position: ${props => props.$historyVisible ? 'relative' : 'absolute'};
  overflow-y: auto;
  
  &:hover {
    opacity: 1;
  }
`;

const StyledHistoryItemContainer = styled.div<{ $historyVisible: boolean }>`
  display: flex;
  min-width: ${props => props.$historyVisible ? 'calc(23% - 10px)' : 'calc(13% - 10px)'};
  height: calc(100% - 10px);
  background-color: blue;
  margin: 5px;
`;


export function PipelineHistorySection({show}: { show: boolean }) {

    return (
        <StyledPipelineHistorySection $historyVisible={show}>
            <StyledHistoryItemContainer $historyVisible={show}/>
            <StyledHistoryItemContainer $historyVisible={show}/>
            <StyledHistoryItemContainer $historyVisible={show}/>
            <StyledHistoryItemContainer $historyVisible={show}/>
            <StyledHistoryItemContainer $historyVisible={show}/>
            <StyledHistoryItemContainer $historyVisible={show}/>
        </StyledPipelineHistorySection>
    )
}