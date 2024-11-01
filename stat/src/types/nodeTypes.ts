import {BlockModel} from "./responseType";

export interface CustomNodeProps {
    data: {
        id: string;
        label: string;
        type: string;
        description: string;
        tag:string;
        blockId: string;
    };
}