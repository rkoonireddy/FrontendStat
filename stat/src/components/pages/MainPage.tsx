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


const StyledMainPage = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 70px 560px 1fr; //made to make the graph view bigger and better interface view adjusted to 560px from 500px
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
    const dispatch = useAppDispatch();
    const [showCreateBlockPopup, setShowCreateBlockPopup] = useState(false);
    const pipeline = useAppSelector(getPipelineModel);
    const activeBlock = useAppSelector(getActiveBlock);
    const [blockTypes, setBlockTypes] = useState<{ label: string, value: string }[]>([]);
    const [blockType, setBlockType] = useState<string>()
    const [blockName, setBlockName] = useState<string>()

    useEffect(() => {
        getBlockTypes().then((types) => {
            const bTypes = types.map((type) => ({label: type.name, value: type.name}));
            setBlockTypes(bTypes);
            if(pipeline.id !== ""){
                dispatch(updatePipeline({pipelineId: pipeline.id}));
            }
        });
    }, []);

    function addNewBlock() {
        if (blockType !== undefined && blockName !== undefined) {
            dispatch(createNewBlock({blockType: blockType, blockName: blockName}));
            setShowCreateBlockPopup(false);
        }
    }

    function closePopup() {
        setShowCreateBlockPopup(false);
    }

    return (
        <StyledMainPage>
            {loading && <Loading />}
            {<ErrorPopup/>}
            {showCreateBlockPopup &&
                <Popup title={"Create Block"} onCloseAction={closePopup}>
                    <StyledInput $largeText={true} $width={"200px"} type="text" placeholder="Block Name" maxLength={18}
                                 onChange={(e) => setBlockName(e.target.value)}/>
                    <Dropdown
                        id="typeDropdown"
                        placeholder="Block Type"
                        value={blockType}
                        options={blockTypes.map((type) => ({ label: type.label.toUpperCase(), value: type.value }))}
                        style={{ width: '200px' }}
                        onChange={(e) => {
                            console.log(e.value);
                            setBlockType(e.value);
                        }}
                        className="p-inputtext-uppercase" // Custom CSS to transform placeholder text
                    />
                    <PrimaryButton text={"Create Block"} action={addNewBlock}/>
                </Popup>}
            <StyledSideBar>
                <STATIconSVG title = {"Home"} style={{width: "50px", height: "50px", margin: "10px"}} onClick={() => navigate("/")}/>
                <PlusSVG title= {"Create a new block"} style={{width: "50px", height: "50px", margin: "10px", fill: "#73B5B4"}}
                         onClick={() => setShowCreateBlockPopup(!showCreateBlockPopup)}/>
                <MenuSVG title = {"Examples"} style={{width: "50px", height: "50px", margin: "10px"}}/>
            </StyledSideBar>
            <StepsSection/>
            {activeBlock && <VizSection block={activeBlock}/>}
        </StyledMainPage>
    );
}

export default MainPage;
