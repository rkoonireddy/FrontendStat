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
    getPipeline, setLoading
} from "../../redux/pipelineSlice";
import {createEdges, createNodesFromBlocks, getFirstKey} from "../../util/util";
import CustomNode from "../customReactFlow/CustomNode";
import CustomStartNode from "../customReactFlow/CustomStartNode";
import CustomEdge from "../customReactFlow/CustomEdge";
import {ReactComponent as RunSVG} from "../../assets/run.svg";
import {ReactComponent as ExportSVG} from "../../assets/filetype-py.svg";

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

    const topologicalSort = (nodes: any[], edges: any[]) => {
        const inDegree = new Map();
        const adjList = new Map();
        const noEdgeNodes = new Set(nodes.map(node => node.id));

        // Initialize in-degree and adjacency list
        nodes.forEach(node => {
            inDegree.set(node.id, 0);
            adjList.set(node.id, []);
        });

        // Populate in-degree and adjacency list
        edges.forEach(edge => {
            inDegree.set(edge.target, inDegree.get(edge.target) + 1);
            adjList.get(edge.source).push(edge.target);
            noEdgeNodes.delete(edge.source);
            noEdgeNodes.delete(edge.target);
        });

        // Queue for nodes with zero in-degree
        const queue: any[] = [];
        inDegree.forEach((degree, node) => {
            if (degree === 0) queue.push(node);
        });

        // Perform topological sort
        const sortedNodes = [];
        while (queue.length > 0) {
            const node = queue.shift();
            sortedNodes.push(node);

            adjList.get(node).forEach((neighbor: any) => {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) queue.push(neighbor);
            });
        }

        return {sortedNodes, noEdgeNodes: Array.from(noEdgeNodes)};
    };

    // const alignNodes = useCallback(async () => {
    //     const { sortedNodes, noEdgeNodes } = topologicalSort(nodes, edges);
    //     setNodes((nds) => nds.map((node) => {
    //         const yPos = sortedNodes.includes(node.id)
    //             ? sortedNodes.indexOf(node.id) * 150
    //             : (sortedNodes.length + noEdgeNodes.indexOf(node.id)) * 150;
    //         return {
    //             ...node,
    //             position: { x: 0, y: yPos },
    //         };
    //     }));
    // }, [nodes]);

    const onConnect = useCallback(
        (connection: any) => {
            const edge = {...connection, type: 'custom-edge'};
            console.log(edge);

            // Check if the edge already exists to avoid duplicates
            setEdges((eds) => {
                const edgeExists = eds.some(e => e.source === edge.source && e.target === edge.target);
                if (!edgeExists) {
                    dispatch(
                        connectTwoBlocks({fromBlockId: edge.source, toBlockId: edge.target, pipelineId: pipeline.id}))
                        .unwrap()
                        .then(() => {
                            return addEdge(edge, eds);
                        })
                        .catch((err) => {
                            // Err carries the error message, but it is already retrieved from pipelineSlice
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
        setOnGraphChange(1); // Set graph change state
    };

    const onNodeDragStop = () => {
        setIsDragging(false);
        setOnGraphChange(1); // Set graph change state
        console.log("Node drag stopped. Current nodes:", nodes); // Log current nodes
        onSave(); // Save graph when dragging stops
    };

    // Save function
    const onSave = useCallback(() => {
        const flow = {nodes, edges};
        localStorage.setItem(flowKey, JSON.stringify(flow));
        console.log("Pipeline flow saved.");
    }, [nodes, edges]);

    // Restore function
    const onRestore = useCallback(() => {
        const flowString = localStorage.getItem(flowKey);
        if (flowString) {
            const {nodes: restoredNodes, edges: restoredEdges} = JSON.parse(flowString);
            setNodes(restoredNodes);
            setEdges(restoredEdges);
            fitView(); // Adjust the view to fit the restored flow
            console.log("Pipeline flow restored.");
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
                {/* <button onClick={alignNodes}>
                    Align Nodes
                </button> */}
                {/* Save and Restore buttons */}
                <button onClick={onSave}>
                    Save graph view
                </button>
                <button onClick={onRestore}>
                    Restore saved view
                </button>
            </Panel>
            <Panel position={"bottom-right"}>
                {pipelineExportableRunnable &&
                    <StyledToolbar>
                        <StyledActionButton title={"Run Pipeline"} onClick={(e) => {
                            onSave();
                            dispatch(setLoading(true));
                            dispatch(executePipeline({
                                pipelineId: pipeline.id,
                                startingBlockId: getFirstKey(pipeline.block_dict) as string
                            }))
                                .then(() => {
                                    onRestore(); // Restore after running pipeline
                                });
                            e.stopPropagation();
                        }}>
                            <RunSVG style={{width: "50px", height: "50px", color: "#00ff00"}}/>
                        </StyledActionButton>
                        {activeBlock && activeBlock?.output?.Dataframe?.data !== undefined ?
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
                    </StyledToolbar>}
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