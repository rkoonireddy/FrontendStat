import styled from "styled-components";
import {clearError} from "../../redux/pipelineSlice";
//import {useAppSelector, useAppDispatch} from "../../hooks";
import {useSelector, useDispatch} from 'react-redux';
import {RootState } from '../../store'; // Adjust the path as necessary
import {ReactComponent as XSVG} from "../../assets/x.svg";

const StyledPopup = styled.div<{ $large: boolean}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${props => props.$large ? '800px' : '600px'};
  height: ${props => props.$large ? '600px' : '400px'};
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  z-index: 100;
  border-radius: 15px;
  box-shadow: 5px 5px 5px 0 rgba(147, 147, 147, 0.75);
  padding: 20px;

  & svg {
    fill: #ff0000;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    width: 30px;
    height: 30px;
  }
`;

const StyledTitle = styled.div`
  font-size: 2rem;
  color: white;
  margin: 15px auto;
`;

export function ErrorPopup() {
    const dispatch = useDispatch();
    const errorStatus = useSelector((state: RootState) => state.pipeline.errorStatus);
    const errorMessage = useSelector((state: RootState) => state.pipeline.errorMessage);;
    if (!errorStatus) return null;
    return (
        <StyledPopup $large={false}>
            <XSVG onClick={() => dispatch(clearError())}/>
            <StyledTitle>Error</StyledTitle>
            <div>{errorMessage}</div>
        </StyledPopup>
    )
}