import {useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import {
    clearDeletePipelinePopup,
    deletePipelineThunk,
    getPipeline,
    resetPipelineData
} from "../../../redux/pipelineSlice";
import {resetData} from "../../../redux/dataSlice";
import {useAppSelector, useAppDispatch} from "../../../hooks";
import {RootState} from '../../../store';
import {PrimaryButton} from "../buttons/PrimaryButton";
import {Popup} from "./Popup";
import styled from "styled-components";

const StyledDeleteButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 0 50px 0;
    width: 100%;
`;


export function DeletePipelinePopup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipeline);
    const deletePipelinePopup = useSelector((state: RootState) => state.pipeline.deletePipelinePopup);

    function handleDelete() {
        dispatch(deletePipelineThunk({pipelineId: pipeline.id}))
            .unwrap()
            .then(() => {
                dispatch(clearDeletePipelinePopup());
                dispatch(resetData());
                dispatch(resetPipelineData());
                navigate("/");
            })
            .catch((error) => {
                console.log("Error deleting pipeline: ", error);
                dispatch(clearDeletePipelinePopup());
            });
    }

    function handleCancel() {
        // Simply close the popup if cancel is clicked
        dispatch(clearDeletePipelinePopup());
    }

    if (!deletePipelinePopup) return null;
    return (
        <Popup title={"Delete Pipeline?\nWARNING: This action is irreversible!"}
               onCloseAction={handleCancel}>
            <StyledDeleteButtonsContainer>
                <PrimaryButton text={"Cancel"} action={handleCancel}/>
                <PrimaryButton text={"Delete"} action={handleDelete} color={"#ff0000"}/>
            </StyledDeleteButtonsContainer>
        </Popup>
    )
}