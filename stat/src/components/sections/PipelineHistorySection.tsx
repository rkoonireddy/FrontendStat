import styled from "styled-components";

const StyledPipelineHistorySection = styled.div<{ historyVisible: boolean }>`
  display:flex;
  justify-content: left;
  margin: 0 10px;
  background-color: #ffffff08;
  padding: 5px;
  width: calc(100% - 20px);
  height: ${props => props.historyVisible ? 'calc(35% - 30px)' : '5%'};
  opacity: ${props => props.historyVisible ? '1' : '0.25'};
  position: ${props => props.historyVisible ? 'relative' : 'absolute'};
  
  &:hover {
    opacity: 1;
  }
  
`;


export function PipelineHistorySection({visible}: { visible: boolean }) {

    return (
        <StyledPipelineHistorySection historyVisible={visible}/>
    )
}