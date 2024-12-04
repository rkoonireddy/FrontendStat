import styled from "styled-components";
import {useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {
    clearDeletePipelinePopup,
    deletePipelineThunk,
    getPipeline,
    resetPipelineData
} from "../../redux/pipelineSlice";
import {resetData} from "../../redux/dataSlice";
import {useAppSelector, useAppDispatch} from "../../hooks";
import {RootState} from '../../store';
import {PopupWithAction} from "./PopupWithAction";

const StyledMessage = styled.div`
  font-size: 0.9rem;
  color: white;
  margin: 15px auto;
  font-family: consolas, monospace;
  text-align: center;
  white-space: pre-line;
`;

export function DeletePipelinePopup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const deletePipelinePopup = useSelector((state: RootState) => state.pipeline.deletePipelinePopup);

    function handleOk() {
        dispatch(deletePipelineThunk({pipelineId: pipeline.id}))
            .unwrap()
            .then(() => {
                // If deletion success, close the popup, clear state and reroute to home
                dispatch(clearDeletePipelinePopup());
                // Reset pipeline data and raw data
                dispatch(resetData());
                dispatch(resetPipelineData());
                // Navigate to home
                navigate("/");
            })
            .catch((error) => {
                console.log("Error deleting pipeline: ", error);
                dispatch(clearDeletePipelinePopup());
            });
    };
    
    function handleCancel() {
        // Simply close the popup if cancel is clicked
        dispatch(clearDeletePipelinePopup());
    };

    if (!deletePipelinePopup) return null;
    return (
        <PopupWithAction
            title={"Delete Pipeline?"}
            onOkAction={() => {handleOk()}}
            onCancelAction={() => {handleCancel()}}
        />
    )
}