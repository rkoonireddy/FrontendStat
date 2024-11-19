import styled from "styled-components";
import {
    ReactFlow,
    Controls,
    Background,
    addEdge, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, {useCallback, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    blockConnectedToPipeline,
    connectTwoBlocks,
    executePipeline, fetchExportPipeline, getActiveBlock, getActiveBlockId,
    getAllEdges,
    getAllNodes,
    getBlocks,
    getPipeline,
    setLoading,
    snoopPipelineColumns
} from "../../redux/pipelineSlice";
import {createEdges, createNodesFromBlocks, getFirstKey} from "../../util/util";
import CustomNode from "../customReactFlow/CustomNode";
import CustomStartNode from "../customReactFlow/CustomStartNode";
import CustomEdge from "../customReactFlow/CustomEdge";
import {ReactComponent as RunSVG} from "../../assets/run.svg";
import {ReactComponent as ExportSVG} from "../../assets/filetype-py.svg";
import {ReactComponent as CopySVG} from "../../assets/copy.svg";

const NodeTypes = {customNode: CustomNode, customStartNode: CustomStartNode};
const edgeTypes = {
    'custom-edge': CustomEdge
}

const StyledStepsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;
    height: calc(100vh - 10px);
    background-color: #ffffff08;
`;

const StyledToolbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 2px;
`;

const StyledActionButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;

    &:hover {
        cursor: pointer;
        scale: 1.05;
    }
`;

const flowKey = 'react-flow-flow';

function Flow() {
    const {fitView} = useReactFlow();
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const blocks = useAppSelector(getBlocks);
    const activeBlockId = useAppSelector(getActiveBlockId);
    const activeBlock = useAppSelector(getActiveBlock);
    const initialNodes = useAppSelector(getAllNodes);
    const initialEdges = useAppSelector(getAllEdges);
    const pipelineExportableRunnable = useAppSelector(state =>
        activeBlockId ? blockConnectedToPipeline(state, activeBlockId) : false
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isDragging, setIsDragging] = useState(false);
    const [onGraphChange, setOnGraphChange] = useState(0);

    useEffect(() => {
        const ns = createNodesFromBlocks(blocks);
        setNodes(ns);
    }, [blocks])

    useEffect(() => {
        const es = createEdges(pipeline);
        setEdges(es);
    }, [pipeline])

    useEffect(() => {
        if (!isDragging) {
            fitView();
        }
    }, [nodes, edges, fitView, isDragging]);


    const onConnect = useCallback(
        (connection: any) => {
            const edge = {...connection, type: 'custom-edge'};

            // Check if the edge already exists to avoid duplicates
            setEdges((eds) => {
                const edgeExists = eds.some(e => e.source === edge.source && e.target === edge.target);
                if (!edgeExists) {
                    dispatch(
                        connectTwoBlocks({fromBlockId: edge.source, toBlockId: edge.target, pipelineId: pipeline.id}))
                        .unwrap()
                        .then(() => {
                            // If edge creation is successful, first let the pipieline snoop the columns
                            return dispatch(snoopPipelineColumns({pipelineId: pipeline.id})).unwrap();
                        })
                        .then(() => {
                            return addEdge(edge, eds);
                        })
                        .catch((err) => {
                            return eds;
                        })
                }
                return eds;
            });
        },
        [setEdges, dispatch, pipeline.id]
    );

    const onNodeDragStart = () => {
        setIsDragging(true);
        setOnGraphChange(1);
    };

    const onNodeDragStop = () => {
        setIsDragging(false);
        setOnGraphChange(1);
        onSave();
    };

    // Save function
    const onSave = useCallback(() => {
        const flow = {nodes, edges};
        localStorage.setItem(flowKey, JSON.stringify(flow));
    }, [nodes, edges]);

    // Restore function
    const onRestore = useCallback(() => {
        const flowString = localStorage.getItem(flowKey);
        if (flowString) {
            const {nodes: restoredNodes, edges: restoredEdges} = JSON.parse(flowString);
            setNodes(restoredNodes);
            setEdges(restoredEdges);
            fitView().then();
        } else {
            console.log("No saved flow found.");
        }
    }, [setNodes, setEdges, fitView]);

    return (
        <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={NodeTypes}
            edgeTypes={edgeTypes}
            fitView
        >
            <Background/>
            <Controls/>
            <Panel position="top-right">
                <button onClick={onSave}>
                    Save graph view
                </button>
                <button onClick={onRestore}>
                    Restore saved view
                </button>
            </Panel>
            <Panel position={"bottom-right"}>
                <StyledToolbar>
                    {pipelineExportableRunnable && activeBlock && activeBlock?.output?.Dataframe?.data !== undefined ?
                        <StyledActionButton title={"Export Pipeline"} onClick={(e) => {
                            dispatch(setLoading(true));
                            dispatch(fetchExportPipeline({
                                pipelineId: pipeline.id,
                                startBlockId: blocks[0].id,
                                endBlockId: activeBlockId ? activeBlockId : blocks[blocks.length - 1].id
                            }));
                            e.stopPropagation();
                        }}>
                            <ExportSVG style={{width: "35px", height: "35px", color: "#ffffff"}}/>
                        </StyledActionButton> : <div style={{width: "35px", height: "35px"}}/>}
                    {pipelineExportableRunnable && <StyledActionButton title={"Run Pipeline"} onClick={(e) => {
                        onSave();
                        dispatch(setLoading(true));
                        dispatch(executePipeline({
                            pipelineId: pipeline.id,
                            startingBlockId: getFirstKey(pipeline.block_dict) as string
                        }))
                            .then(() => {
                                onRestore();
                            });
                        e.stopPropagation();
                    }}>
                        <RunSVG style={{width: "50px", height: "50px", color: "#00ff00"}}/>
                    </StyledActionButton>}
                    <StyledActionButton title={"Copy Pipeline ID"} onClick={() => {
                        navigator.clipboard.writeText(pipeline.id);
                        alert("Pipeline ID copied to clipboard.");
                    }}>
                        <CopySVG style={{width: "35px", height: "35px", fill: "#ffffff"}}/>
                    </StyledActionButton>
                </StyledToolbar>
            </Panel>
        </ReactFlow>
    );
}

export function StepsSection() {
    return (
        <StyledStepsContainer>
            <ReactFlowProvider>
                <Flow/>
            </ReactFlowProvider>
        </StyledStepsContainer>
    );
}