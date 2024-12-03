import styled from "styled-components";
import {clearDeletePipelinePopup, deletePipelineThunk, getPipeline} from "../../redux/pipelineSlice";
import {useSelector, useDispatch} from 'react-redux';
import {useAppSelector} from "../../hooks";
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
    const dispatch = useDispatch();
    const pipeline = useAppSelector(getPipeline);
    const deletePipelinePopup = useSelector((state: RootState) => state.pipeline.deletePipelinePopup);

    function handleOk() {
        console.log("OK");
        deletePipelineThunk({pipelineId: pipeline.id});
    };
    
    function handleCancel() {
        console.log("Cancel");
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