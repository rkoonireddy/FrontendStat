export interface CreateBlockResponse {
    block_id: string;
}

type DataColumn = {
    data: number[] | (number | string | null)[];
};

type DataCollection = {
    id: string;
    name: string;
    freq_hz: number;
    data: {
        data: DataColumn;
        freq_hz: number;
        index: number[];
        name: string;
    }[];
    input_data: {
        data: {
            [key: string]: DataColumn;
        };
    };
    metadata: {
        created_at: string;
        some_other_metadata: string;
    };
};

export type BlockType = {
    id: string;
    name: string;
    type: string;
    input: {
        [key: string]: DataCollection;
    };
    output: {
        [key: string]: DataCollection;
    };
    metadata: {
        created_at: string;
        some_other_metadata: string;
    };
};