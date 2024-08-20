import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {parseCSV} from "../service/dataService";


interface IDataState {
    rawData: { [key: string]: string; }[],
    filteredData: { [key: string]: string; }[]
}

const initialState: IDataState = {
    rawData: [] as Array<{ [key: string]: string }>,
    filteredData: [] as Array<{ [key: string]: string }>
}

export const readData = createAsyncThunk("data/readData",
    async (rawData: FormData, thunkAPI) => {
    try {
        const csvData = await parseCSV({formData: rawData});
        return csvData;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }

});


export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setRawData: (state: { rawData: any; }, action: { payload: any; }) => {
            state.rawData = action.payload;
        },
        setFilteredData: (state: { filteredData: any; }, action: { payload: any; }) => {
            state.filteredData = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(readData.fulfilled, (state, action) => {
            state.rawData = action.payload;
        });
        builder.addCase(readData.rejected, (state, action) => {
            console.log(action.error.message);
        });
    }
})

export const { setRawData, setFilteredData } = dataSlice.actions;

export default dataSlice.reducer;
