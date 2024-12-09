import {BlockModel} from "./responseType";
import { Node } from '@xyflow/react';


export type CompleteNodeProps = {
    id: string,
    type: string,
    description: string,
    tag: string,
    data: CustomNodeProps,
    position: { x: number, y: number }
}

export type CustomNodeProps = {
    id: string;
    label: string;
    type: string;
    description: string;
    tag: string;
    blockId: string;
}

export type CompleteNode = Node<CustomNodeProps>;

export type CustomEdge = {
    id: string,
    type: string,
    source: string,
    target: string
}