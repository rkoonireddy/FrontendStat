import styled from "styled-components";
import {ReactComponent as STATIconSVG} from "../../assets/icon.svg";
import {ReactComponent as MenuSVG} from "../../assets/menu.svg";
import {ReactComponent as PlusSVG} from "../../assets/plus-square.svg";
import {useNavigate} from "react-router-dom";
import {StepsSection} from "../sections/StepsSection";
import {VizSection} from "../sections/VizSection";
import {useDispatch} from "react-redux";
import {addStep, createNewBlock, createNewPipeline, getActiveBlock, getPipelineModel} from "../../redux/pipelineSlice";
import {AppDispatch} from "../../store";
import {useAppSelector} from "../../hooks";
import {useState} from "react";


const StyledMainPage = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 70px 600px 1fr;
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
`;

const StyledSideBar = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  & svg:hover {
    scale: 1.05;
    cursor: pointer;
  }
`;

const StyledCreateBlockPopup = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 600px;
  height: 600px;
  background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  margin: auto;
  z-index: 100;
  border-radius: 15px;
  box-shadow: 5px 5px 5px 0 rgba(147, 147, 147, 0.75);
`;

const StyledCreateBlockTitle = styled.div`
  font-size: 2rem;
  color: white;
  margin: 15px auto;
`;


function MainPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    dispatch(createNewPipeline());
    const pipeline = useAppSelector(getPipelineModel);
    const activeBlock = useAppSelector(getActiveBlock);

    const [blockType, setBlockType] = useState<string>()
    const [blockName, setBlockName] = useState<string>()


    function addNewBlock() {
        if (blockType !== undefined && blockName !== undefined) {
            dispatch(createNewBlock({blockType: blockType, blockName: blockName}));

        }

    }

    return (
        <StyledMainPage>
            <StyledCreateBlockPopup>
                <StyledCreateBlockTitle>Create Block</StyledCreateBlockTitle>
                <input type="text" placeholder="Block Name" onChange={(e) => setBlockName(e.target.value)}/>
                <input type="text" placeholder="Block Type" onChange={(e) => setBlockType(e.target.value)}/>
                <button onClick={() => addNewBlock()}>Create Block</button>
            </StyledCreateBlockPopup>
            <StyledSideBar>
                <STATIconSVG style={{width: "50px", height: "50px", margin: "10px"}} onClick={() => navigate("/")}/>
                <PlusSVG style={{width: "50px", height: "50px", margin: "10px", fill: "#73B5B4"}} onClick={() => addNewBlock()}/>
                <MenuSVG style={{width: "50px", height: "50px", margin: "10px"}}/>
            </StyledSideBar>
            <StepsSection/>
            <VizSection/>
        </StyledMainPage>
    );
}

export default MainPage;
