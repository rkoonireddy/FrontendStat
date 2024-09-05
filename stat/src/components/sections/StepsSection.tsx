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
import {connectTwoBlocks, getAllEdges, getAllNodes, getBlocks, getPipeline} from "../../redux/pipelineSlice";
import {createEdges, createNodesFromBlocks} from "../../util/util";
import CustomNode from "../customReactFlow/CustomNode";
import CustomStartNode from "../customReactFlow/CustomStartNode";
import CustomEdge from "../customReactFlow/CustomEdge";

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
        alignNodes();
    }, [blocks])

    useEffect(() => {
        const es = createEdges(pipeline);
        console.log(es)
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

        nodes.forEach(node => {
            inDegree.set(node.id, 0);
            adjList.set(node.id, []);
        });

        edges.forEach(edge => {
            inDegree.set(edge.target, inDegree.get(edge.target) + 1);
            adjList.get(edge.source).push(edge.target);
        });

        const queue: any[] = [];
        inDegree.forEach((degree, node) => {
            if (degree === 0) queue.push(node);
        });

        const sortedNodes = [];
        while (queue.length > 0) {
            const node = queue.shift();
            sortedNodes.push(node);

            adjList.get(node).forEach((neighbor: any) => {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) queue.push(neighbor);
            });
        }

        return sortedNodes;
    };

    const alignNodes = useCallback(async () => {
        const sortedNodeIds = topologicalSort(nodes, edges);
        await setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                position: {x: 0, y: sortedNodeIds.indexOf(node.id) * 150},
            }))
        );
    }, [nodes, edges, setNodes, fitView]);

    const onConnect = useCallback(
        (connection: any) => {
            const edge = {...connection, type: 'custom-edge'};
            console.log(edge)
            dispatch(connectTwoBlocks({fromBlockId: edge.source, toBlockId: edge.target, pipelineId: pipeline.id}));
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges],
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
            <button onClick={alignNodes} >
                Align Nodes
            </button>
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