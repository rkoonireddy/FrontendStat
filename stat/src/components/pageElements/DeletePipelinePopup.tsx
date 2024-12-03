import styled from "styled-components";
import {clearError} from "../../redux/pipelineSlice";
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
    return (
        <PopupWithAction
            title={"Delete Pipeline?"}
            onOkAction={() => {console.log("OkAction clicked")}}
            onCancelAction={() => {console.log("CancelAction clicked")}}
        />
    )
}