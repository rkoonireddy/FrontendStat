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
    getActiveBlock,
    getActiveBlockId,
    getAllEdges,
    getAllNodes,
    getBlocks,
    getPipeline,
    setLoading,
    showDeletePipelinePopup, reactFlowState, addReactFlowState, reloadView, setReloadView
} from "../../redux/pipelineSlice";
import {createEdges, getFirstKey} from "../../util/util";
import CustomNode from "../customReactFlow/CustomNode";
import CustomStartNode from "../customReactFlow/CustomStartNode";
import CustomEdge from "../customReactFlow/CustomEdge";
import {ReactComponent as RunSVG} from "../../assets/run.svg";
import {ReactComponent as ExportSVG} from "../../assets/filetype-py.svg";
import {ReactComponent as CopySVG} from "../../assets/copy.svg";
import {ReactComponent as TrashSVG} from "../../assets/trash.svg";
import {createNodesFromBlocks} from "../../util/blockUtil";
import {connectTwoBlocks, executePipeline, fetchExportPipeline, snoopPipelineColumns} from "../../redux/pipelineThunk";

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
    width: 450px;
    left: 0;
    right: 0;
    margin: 0 auto;
`;

const StyledActionButton = styled.div<{ $position?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    ${props => props.$position === "left" ? "margin-right: auto;" : ""}
    
    & svg {
        fill: #ffffff;
    }

    &:hover {
        cursor: pointer;
        scale: 1.05;
    }
    
    & svg.delete:hover {
        fill: #ff0000;
    }
`;

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
    const reactFlowString = useAppSelector(reactFlowState);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isDragging, setIsDragging] = useState(false);
    const restoreNeeded = useAppSelector(reloadView);

    useEffect(() => {
        dispatch(setReloadView(true));
        console.log("Reload view set to true.");
    }, []);

    useEffect(() => {
        const ns = createNodesFromBlocks(blocks);
        setNodes(ns);
    }, [blocks])

    useEffect(() => {
        const es = createEdges(pipeline);
        setEdges(es);
    }, [pipeline])

    useEffect(() => {
        if (reactFlowString && !isDragging && restoreNeeded) {
            const {nodes: restoredNodes, edges: restoredEdges} = JSON.parse(reactFlowString);
            if (JSON.stringify(nodes) !== JSON.stringify(restoredNodes)) {
                setNodes(restoredNodes);
                setEdges(restoredEdges);
                fitView().then();
            }
            dispatch(setReloadView(false))
        }
    }, [nodes]);


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
    )

    const onNodeDragStart = () => {
        setIsDragging(true);
    }

    const onNodeDragStop = () => {
        setIsDragging(false);
        saveView();
    }

    function saveView() {
        const flow = {nodes, edges};
        dispatch(addReactFlowState(JSON.stringify(flow)));
    }

    function restoreView()  {
        if (reactFlowString) {
            const {nodes: restoredNodes, edges: restoredEdges} = JSON.parse(reactFlowString);
            setNodes(restoredNodes);
            setEdges(restoredEdges);
            fitView().then();
            console.log("Flow restored.");
        } else {
            console.log("No saved flow found.");
        }
    }

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
            <Controls position="top-left"/>
            <Panel position="top-right">
                <button onClick={saveView}>
                    Save graph view
                </button>
                <button onClick={restoreView}>
                    Restore saved view
                </button>
            </Panel>
            <Panel position={"bottom-right"}>
                <StyledToolbar>
                    <StyledActionButton $position={"left"} title={"Delete Pipeline"} onClick={() => {
                        dispatch(showDeletePipelinePopup());
                    }}>
                        <TrashSVG className={"delete"} style={{width: "35px", height: "35px"}}/>
                    </StyledActionButton>
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
                            <ExportSVG style={{width: "35px", height: "35px"}}/>
                        </StyledActionButton> : <div style={{width: "35px", height: "35px"}}/>}
                        <StyledActionButton title={"Run Pipeline"} onClick={(e) => {
                        saveView();
                        dispatch(setLoading(true));
                        dispatch(executePipeline({
                            pipelineId: pipeline.id,
                            startingBlockId: getFirstKey(pipeline.block_dict) as string
                        }));
                        e.stopPropagation();
                    }}>
                        <RunSVG style={{width: "50px", height: "50px", fill: "#00ff00"}}/>
                    </StyledActionButton>
                    <StyledActionButton title={"Copy Pipeline ID"} onClick={() => {
                        navigator.clipboard.writeText(pipeline.id);
                        alert("Pipeline ID copied to clipboard.");
                    }}>
                        <CopySVG style={{width: "35px", height: "35px"}}/>
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