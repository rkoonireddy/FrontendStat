import styled from "styled-components";
import {ReactComponent as STATIconSVG} from "../../assets/icon.svg";
import {ReactComponent as MenuSVG} from "../../assets/menu.svg";
import {ReactComponent as PlusSVG} from "../../assets/plus-square.svg";
import {useNavigate} from "react-router-dom";
import {StepsSection} from "../sections/StepsSection";
import {VizSection} from "../sections/VizSection";
import {
    createNewBlock,
    getActiveBlock, getLoading,
    getPipelineModel, updatePipeline
} from "../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useEffect, useState} from "react";
import {StyledInput} from "../controls/InputControl";
import {Dropdown} from "primereact/dropdown";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {getBlockTypes} from "../../service/blockService";
import {Popup} from "../pageElements/Popup";
import {Loading} from "../pageElements/Loading";
import {ErrorPopup} from "../pageElements/ErrorPopup";
import {BlockPopup} from "../pageElements/BlockPopup";


const StyledMainPage = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 70px 500px calc(100vw - 570px);
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


function MainPage() {
    const loading = useAppSelector(getLoading);
    const navigate = useNavigate();
    const [showCreateBlockPopup, setShowCreateBlockPopup] = useState(false);
    const activeBlock = useAppSelector(getActiveBlock);

    function closePopup() {
        setShowCreateBlockPopup(false);
    }

    return (
        <StyledMainPage>
            {loading && <Loading />}
            {<ErrorPopup/>}
            {showCreateBlockPopup &&
                <BlockPopup onCloseAction={closePopup}/>}
            <StyledSideBar>
                <STATIconSVG style={{width: "50px", height: "50px", margin: "10px"}} onClick={() => navigate("/")}/>
                <PlusSVG style={{width: "50px", height: "50px", margin: "10px", fill: "#73B5B4"}}
                         onClick={() => setShowCreateBlockPopup(!showCreateBlockPopup)}/>
                <MenuSVG style={{width: "50px", height: "50px", margin: "10px"}}/>
            </StyledSideBar>
            <StepsSection/>
            {activeBlock && <VizSection block={activeBlock}/>}
        </StyledMainPage>
    );
}

export default MainPage;
