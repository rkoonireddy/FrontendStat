import styled from "styled-components";
import {getActiveBlockId, getBlocks, setActiveBlockId} from "../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {LineChart} from "../charts/LineChart";
import React from "react";
import {HorizontalScrollContainer} from "../pageElements/HorizontalScrollContainer";

const StyledPipelineHistorySection = styled.div<{ $historyVisible: boolean }>`
    display: flex;
    justify-content: left;
    margin: 0 10px;
    padding: 5px;
    width: calc(100% - 20px);
    height: ${props => props.$historyVisible ? 'calc(35% - 30px)' : '0%'};
    opacity: ${props => props.$historyVisible ? '1' : '0.25'};
    position: ${props => props.$historyVisible ? 'relative' : 'absolute'};
    overflow-y: auto;
    max-height: 20vh;

    &:hover {
        opacity: 1;
    }
`;

const StyledHistoryItemContainer = styled.div<{ $historyVisible: boolean, $active: boolean }>`
    display: flex;
    min-width: ${props => props.$historyVisible ? 'calc(30% - 10px)' : 'calc(13% - 10px)'};
    height: calc(100% - 10px);
    margin: 5px;
    padding: 5px;
    background-color: #ffffff08;
    overflow-y: clip;
    border: ${props => props.$active ? '1px solid #ffffff80' : ''};
    flex-direction: column;
    color: #ffffff;

    &:hover {
        cursor: pointer;
        opacity: 1;
        border: 1px solid #ffffff;
    }
`;


export function PipelineHistorySection({show}: { show: boolean }) {

    const blocks = useAppSelector(getBlocks);
    const activeBlockId = useAppSelector(getActiveBlockId);
    const dispatch = useAppDispatch();

    return (
        <StyledPipelineHistorySection $historyVisible={show} key={"pipeline-history"}>
            <HorizontalScrollContainer id={"pipeline-history"}>
                {blocks.map((block) => (
                        block.type !== 'CSVStringLoader' && (
                            <StyledHistoryItemContainer key={block.id} $historyVisible={show}
                                                        $active={block.id === activeBlockId}
                                                        onClick={() => dispatch(setActiveBlockId(block.id))}>
                                <div>{block.name}</div>
                                <LineChart block={block} small={true}/>
                            </StyledHistoryItemContainer>)
                    )
                )}
            </HorizontalScrollContainer>
        </StyledPipelineHistorySection>
    )
}