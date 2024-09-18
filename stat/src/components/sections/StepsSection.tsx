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
    connectTwoBlocks,
    executePipeline, getActiveBlockId,
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

const StyledRunButton = styled.div`
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

function Flow() {
    const {fitView} = useReactFlow();
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const blocks = useAppSelector(getBlocks);
    const initialNodes = useAppSelector(getAllNodes);
    const initialEdges = useAppSelector(getAllEdges);


    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isDragging, setIsDragging] = useState(false);


    useEffect(() => {
        const ns = createNodesFromBlocks(blocks);
        setNodes(ns);
        if (nodes.length > 1) {
            // alignNodes();
        }
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

    return { sortedNodes, noEdgeNodes: Array.from(noEdgeNodes) };
};

const alignNodes = useCallback(async () => {
    const { sortedNodes, noEdgeNodes } = topologicalSort(nodes, edges);
    await setNodes((nds) =>
        nds.map((node) => {
            const yPos = sortedNodes.includes(node.id)
                ? sortedNodes.indexOf(node.id) * 150
                : (sortedNodes.length + noEdgeNodes.indexOf(node.id)) * 150;
            return {
                ...node,
                position: { x: 0, y: yPos },
            };
        })
    );
}, [nodes, edges, setNodes, fitView]);

    const onConnect = useCallback(
        (connection: any) => {
            const edge = {...connection, type: 'custom-edge'};
            console.log(edge);

            // Check if the edge already exists to avoid duplicates
            setEdges((eds) => {
                const edgeExists = eds.some(e => e.source === edge.source && e.target === edge.target);
                if (!edgeExists) {
                    dispatch(connectTwoBlocks({fromBlockId: edge.source, toBlockId: edge.target, pipelineId: pipeline.id}));
                    return addEdge(edge, eds);
                }
                return eds;
            });
        },
        [setEdges, dispatch, pipeline.id]
    );

    const onNodeDragStart = () => {
        setIsDragging(true);
    };

    const onNodeDragStop = () => {
        setIsDragging(false);
    };

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
                <button onClick={alignNodes}>
                    Align Nodes
                </button>
            </Panel>
            <Panel position={"bottom-right"}>
                <StyledRunButton title={"Run Pipeline"} onClick={(e) => {
                    dispatch(setLoading(true));
                    dispatch(executePipeline({pipelineId: pipeline.id, startingBlockId: getFirstKey(pipeline.block_dict) as string}));
                    e.stopPropagation();
                }}>
                    <RunSVG style={{width: "50px", height: "50px", color: "#00ff00"}}/>
                </StyledRunButton>
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
    )
}