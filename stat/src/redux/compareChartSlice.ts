import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlockModel } from '../types/responseType';
import { COLOR_PALETTE } from '../Theme';

interface CompareChartsState {
    blocks: BlockModel[];
    selectedFilters: { [key: string]: string[] };
    selectedColors: { [key: string]: string };
    selectedOpacity: { [key: string]: number };
}

const initialState: CompareChartsState = {
    blocks: [],
    selectedFilters: {},
    selectedColors: {},
    selectedOpacity: {},
};


const compareChartSlice = createSlice({
    name: 'compareCharts',
    initialState,
    reducers: {
        setBlocks(state, action: PayloadAction<BlockModel[]>) {
            state.blocks = action.payload.filter(block => block.type !== 'CSVStringLoader');

            state.blocks.forEach(block => {
                if (!state.selectedOpacity[block.id]) {
                    state.selectedOpacity[block.id] = 100;
                }
                if (!state.selectedColors[block.id]) {
                    state.selectedColors[block.id] = COLOR_PALETTE[state.blocks.indexOf(block) % COLOR_PALETTE.length];
                }
            });
        },
        initializeSelectedFilters(state) {
            state.blocks.forEach(block => {
                if (!state.selectedFilters[block.id]) {
                    state.selectedFilters[block.id] = [];
                }
            });
        },
        setSelectedFilters(state, action: PayloadAction<{ blockId: string; filters: string[] }>) {
            const { blockId, filters } = action.payload;
            state.selectedFilters[blockId] = filters;
        },
        setSelectedColor(state, action: PayloadAction<{ blockId: string; color: string }>) {
            const { blockId, color } = action.payload;
            state.selectedColors[blockId] = color;
        },
        setSelectedOpacity(state, action: PayloadAction<{ blockId: string; opacity: number }>) {
            const { blockId, opacity } = action.payload;
            state.selectedOpacity[blockId] = opacity;
        }
    },
});

export const { setBlocks, initializeSelectedFilters, setSelectedFilters, setSelectedColor, setSelectedOpacity } = compareChartSlice.actions;
export default compareChartSlice.reducer;
