import styled from "styled-components";
import {ReactComponent as STATIconSVG} from "../../assets/icon.svg";
import {ReactComponent as MenuSVG} from "../../assets/menu.svg";
import {useNavigate} from "react-router-dom";
import {StepsSection} from "../sections/StepsSection";
import {VizSection} from "../sections/VizSection";
import {useDispatch} from "react-redux";
import {addStep, createNewBlock, createNewPipeline, getPipelineModel} from "../../redux/pipelineSlice";
import {AppDispatch} from "../../store";
import {useAppSelector} from "../../hooks";
import {useState} from "react";


const StyledMainPage = styled.div`
  display: grid;
  grid-template-columns: 100px 600px 1fr;
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
`;

const StyledSideBar = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  & svg:hover {
    scale: 1.05;
    cursor: pointer;
  }
`;


function MainPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    dispatch(createNewPipeline());
    const pipeline = useAppSelector(getPipelineModel);

    const [blockType, setBlockType] = useState<string>()
    const [blockName, setBlockName] = useState<string>()


    function addNewBlock() {
        if (blockType !== undefined && blockName !== undefined) {
            dispatch(createNewBlock({blockType: blockType, blockName: blockName}))
        }

    }

    return (
        <StyledMainPage>
            <StyledSideBar>
                <STATIconSVG style={{width: "50px", height: "50px", margin: "10px"}} onClick={() => navigate("/")}/>
                <MenuSVG style={{width: "50px", height: "50px", margin: "10px"}}/>
            </StyledSideBar>
            <StepsSection/>
            <VizSection/>
        </StyledMainPage>
    );
}

export default MainPage;
