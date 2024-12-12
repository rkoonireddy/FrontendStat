import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Handle, Position } from '@xyflow/react';
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
    blockConnectedToPipeline,
    getActiveBlockId, getBlockById,
    getPipelineModel,
    setActiveBlockId
} from "../../redux/pipelineSlice";
import { BlockTypeModel } from '../../types/responseType';
import { ReactComponent as TrashSVG } from "../../assets/trash3-fill.svg";
import { ReactComponent as InfoSVG } from "../../assets/info-circle-fill.svg";
import { ReactComponent as CloseSVG } from '../../assets/x.svg';
import { LineChart } from "../charts/LineChart";
import { deleteBlockFromPipeline } from "../../redux/pipelineThunk";
import { CustomNodeProps } from '../../types/reactFlowCustomTypes';
import { getBlockTypes } from '../../service/blockService';

export const StyledNodeContainer = styled.div<{ $active?: boolean }>`
    padding: 5px;
    border: 1px solid ${props => !props.$active ? '#73B5B4' : '#73B5B4'};
    border-radius: 5px;
    background: ${props => props.$active ? '#eeede9' : 'linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%)'};
    position: relative;
    width: 100px;
    min-height: 25px;
    text-align: center;
`;

export const StyledNodeLabel = styled.div<{ $active?: boolean, $small?: boolean }>`
    font-size: ${props => (props.$small ? '0.5rem' : '0.75rem')};
    font-weight: normal;
    color: ${props => !props.$active ? '#ffffff' : '#73B5B4'};
`;

export const StyledNodeType = styled.div`
    font-size: 5px;
    position: absolute;
    bottom: 0;
    right: 3px;
    color: #888;
`;

export const StyledTag = styled.div`
    font-size: 5px;
    position: fixed;
    bottom: -4px;
    left: 3px;
    color: #888;
`;

export const StyledDeleteButton = styled.div`
    position: absolute;
    top: -5px;
    right: 3px;
    opacity: 0.25;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
    
    & svg:hover {
        fill: #ff0000!important;
    }
`;

export const StyledNodeInfoIcon = styled(InfoSVG)<{ $scale?: number }>`
    position: absolute;
    top: ${({ $scale }) => ($scale ? $scale * 2 : 2)}px;    
    left: ${({ $scale }) => ($scale ? $scale * 3 : 3)}px;
    width: ${({ $scale }) => ($scale ? $scale * 7 : 7)}px;
    height: ${({ $scale }) => ($scale ? $scale * 7 : 7)}px;
    color: #989898;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
        color: #0056b3;
    }
`;

export const StyledInfoPopup = styled.div<{ $visible: boolean, $scale?: number }>`
    position: absolute;
    top: ${({ $scale }) => ($scale ? $scale * 10 : 10)}px;
    left: 0;
    font-size: ${({ $scale }) => ($scale ? $scale * 0.5 : 0.5)}vw;
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
    color: #73B5B4;
    padding: 2px 7px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    width: ${({ $scale }) => ($scale ? $scale * 150 : 150)}px;
    max-height: 250px;
    overflow-y: auto;
    display: ${({$visible}) => ($visible ? 'block' : 'none')};

    .description {
        font-family: 'Archivo', sans-serif;
        ::-webkit-scrollbar {
            display: none;
        }
    }

    .description-title {
        display: none;
    }
    
    .description-subtitle {
        margin: 25px 0 10px 0;
        font-size: 0.5rem;
    }

    .description-normal {
        margin: 10px 0;
        display:flex;
        justify-content: space-between;
        align-items: center;
    }

    & img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
    }
    
    .description-link a {
        font-style: italic;
        color: #73B5B4;
    }

    &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

export const StyledCloseInfoIcon = styled(CloseSVG)<{$scale?: number}>`
    position: absolute;
    top: ${({ $scale }) => ($scale ? $scale * 1 : 1)}px;
    right: ${({ $scale }) => ($scale ? $scale * 1 : 1)}px;
    width: ${({ $scale }) => ($scale ? $scale * 10 : 10)}px;
    height: ${({ $scale }) => ($scale ? $scale * 10 : 10)}px;
    opacity: 0.5;
    color: #ff0000;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

export const StyledNodeOutputContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: -30px;
    right: -10px;
    width: 40px;
    height: 20px;
    border-radius: 5px;
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
    color: #9e9d9d;

    &:hover {
        cursor: pointer;
    }
`;

export const StyledNodeOutputPopup = styled.div`
    position: absolute;
    display: flex;
    top: -105px;
    left: -100px;
    width: 200px;
    height: 100px;
    overflow-y: clip;
    background: linear-gradient(to bottom right, #3D3D3DDD 0%, #000000DD 100%);
    border-radius: 5px;
    z-index: 100;
`;

const CustomNode = ({ data }: { data: CustomNodeProps }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);
    const block = useAppSelector(state => getBlockById(state, data.blockId));
    const [blockTypes, setBlockTypes] = useState<BlockTypeModel[]>([]);
    const [blockType, setBlockType] = useState<BlockTypeModel>();
    const [showOutputPopup, setShowOutputPopup] = useState(false);
    const blockConnected = useAppSelector(state => blockConnectedToPipeline(state, data.blockId));

    const togglePopup = () => {
        setIsInfoVisible(prev => !prev);
    };

    useEffect(() => {
        getBlockTypes().then((types) => {
            setBlockTypes(types);
            const matchingType = types.find(type => type.name.toLowerCase() === data.type.toLowerCase());
            setBlockType(matchingType);
        });
    }, [data.type]);

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <Handle type="target" position={Position.Top}/>
            <StyledDeleteButton title={"Delete Block"} onClick={(e) => {
                dispatch(deleteBlockFromPipeline({ pipelineId: pipeline.id, blockId: data.id }));
                e.stopPropagation();
            }}>
                <TrashSVG style={{ width: "7px", height: "7px", fill: (data.id === activeNodeId ? '#939393BF' : '#f0f0f0f0') }} />
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>
                {data.label}
            </StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom}/>
            <StyledNodeInfoIcon
                title={"More information"}
                onClick={(e) => {
                    e.stopPropagation();
                    togglePopup();
                }}
            >
                <InfoSVG />
            </StyledNodeInfoIcon>
            <StyledInfoPopup $visible={isInfoVisible}>
                <StyledCloseInfoIcon onClick={(e) => { e.stopPropagation(); setIsInfoVisible(false); }}>
                    <CloseSVG />
                </StyledCloseInfoIcon>
                {blockType ? (
                    <div dangerouslySetInnerHTML={{ __html: blockType.description }} />
                ) : (
                    <p>{data.description}</p>
                )}
            </StyledInfoPopup>
            <StyledTag>{data.tag}</StyledTag>
            <Handle type="source" position={Position.Bottom}/>
            {blockConnected && block && block?.output?.Dataframe?.data !== undefined &&
                <StyledNodeOutputContainer onMouseEnter={() => setShowOutputPopup(true)}
                                           onMouseLeave={() => setShowOutputPopup(false)}>
                    <LineChart block={block} small={true} mini={true}/>
                    {showOutputPopup &&
                            <StyledNodeOutputPopup>
                                <LineChart block={block} small={true}/>
                            </StyledNodeOutputPopup>}
                </StyledNodeOutputContainer>}
        </StyledNodeContainer>
    )
        ;
};

export default CustomNode;