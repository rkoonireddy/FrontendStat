import styled from "styled-components";
import {clearError} from "../../../redux/pipelineSlice";
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../../store';
import {Popup} from "./Popup";

const StyledMessage = styled.div`
  font-size: 0.9rem;
  color: white;
  margin: 15px auto;
  font-family: consolas, monospace;
  text-align: center;
  white-space: pre-line;
`;

export function ErrorPopup() {
    const dispatch = useDispatch();
    const errorStatus = useSelector((state: RootState) => state.pipeline.errorStatus);
    const errorMessage = useSelector((state: RootState) => state.pipeline.errorMessage);
    if (!errorStatus) return null;
    return (
        <Popup title={"Error"} onCloseAction={() => dispatch(clearError())}>
            <StyledMessage>{errorMessage}</StyledMessage>
        </Popup>
    )
}