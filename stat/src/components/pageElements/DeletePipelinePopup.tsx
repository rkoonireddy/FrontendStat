import styled from "styled-components";
import {clearDeletePipelinePopup} from "../../redux/pipelineSlice";
import {useSelector, useDispatch} from 'react-redux';
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
    const deletePipelinePopup = useSelector((state: RootState) => state.pipeline.deletePipelinePopup);
    if (!deletePipelinePopup) return null;
    return (
        <PopupWithAction
            title={"Delete Pipeline?"}
            onOkAction={() => {dispatch(clearDeletePipelinePopup())}}
            onCancelAction={() => {dispatch(clearDeletePipelinePopup())}}
        />
    )
}