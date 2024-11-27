import {StyledInput} from "../controls/InputControl";
import {Dropdown} from "primereact/dropdown";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {Popup} from "./Popup";
import {useEffect, useState} from "react";
import {getBlockTypes} from "../../service/blockService";
import {createNewBlock, getActiveBlock, getPipelineModel, updatePipeline} from "../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import styled from "styled-components";
import {BlockTypeModel} from "../../types/responseType";

const StyledCreateBlocksContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const StyledBlockTypesContainer = styled.div`
    width: 200px;
    height: 100%;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const StyledBlockTypeSelector = styled.div<{ $selected?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 77px;
    background: linear-gradient(to bottom right, #3D3D3DDD 0%, #000000DD 100%);
    box-sizing: border-box;
    border-radius: 10px;
    color: ${props => props.$selected ? '#ffffff' : '#ffffffAA'};
    border: ${props => props.$selected ? "1px solid #ffffffAA" : ""};

    &:hover {
        cursor: pointer;
        background: linear-gradient(to bottom right, #3D3D3DAA 0%, #000000AA 100%);
        color: #ffffff;
        border: 1px solid #ffffff;
    }
`;

const StyledBlockTypeContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #ffffff;
`;


const StyledBlockTypeTitle = styled.div`
    font-size: 1.5rem;
    margin: 10px;
`;

const StyledBlockTypeContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    
    .description {
        display: flex;
        flex-direction: column;
        height: 375px;
        padding: 15px;
        overflow-y: scroll;
    }
    
    .description-title {
        display: none;
    }
    
    .description-normal {
        max-width: 400px;
        margin: 10px 0;
    }
    
    
    
    .description-image {
        margin: -25px 0 0 auto;
        width: 200px;
    }

    
    img {
        width: 100%;
        height: 100%;
    }

`;

const StyledBlockTypeDescription = styled.div`
    font-size: 1rem;
    margin: 10px;
    width: 50%;
    
    
`;

const StyledBlockTypeImages = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 50%;
`;


const StyledBlockTypeCreationContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    margin: auto 10px 10px 10px;
`;

export function BlockPopup({onCloseAction}: { onCloseAction: () => void }) {
    const dispatch = useAppDispatch();
    const pipeline = useAppSelector(getPipelineModel);
    const [blockTypes, setBlockTypes] = useState<BlockTypeModel[]>([]);
    const [blockType, setBlockType] = useState<BlockTypeModel>()
    const [blockName, setBlockName] = useState<string>()

    useEffect(() => {
        getBlockTypes().then((types) => {
            setBlockTypes(types);
            if (pipeline.id !== "") {
                dispatch(updatePipeline({pipelineId: pipeline.id}));
            }
        });
    }, []);

    function addNewBlock() {
        if (blockType !== undefined && blockName !== undefined) {
            dispatch(createNewBlock({blockType: blockType.name, blockName: blockName}));
            onCloseAction();
        }
    }

    return (
        <Popup title={"Create Block"} onCloseAction={onCloseAction} noPadding={true}>
            <StyledCreateBlocksContainer>
                <StyledBlockTypesContainer>
                    {blockTypes.map((type) => (
                        <StyledBlockTypeSelector
                            key={type.name}
                            $selected={blockType === type}
                            onClick={() => setBlockType(type)}
                        >
                            {type.name.replace("_", " ")}
                        </StyledBlockTypeSelector>
                    ))}
                </StyledBlockTypesContainer>
                <StyledBlockTypeContainer>
                    {blockType ?
                        <>
                            <StyledBlockTypeTitle>{blockType.name.replace("_", " ")}</StyledBlockTypeTitle>
                            <StyledBlockTypeContent dangerouslySetInnerHTML={{ __html: blockType.description}}/>
                                {/*<StyledBlockTypeDescription dangerouslySetInnerHTML={{ __html: blockType.description}}></StyledBlockTypeDescription>*/}
                            {/*    <StyledBlockTypeDescription>Test</StyledBlockTypeDescription>*/}
                            {/*    <StyledBlockTypeImages> </StyledBlockTypeImages>*/}
                            {/*</StyledBlockTypeContent>*/}
                            <StyledBlockTypeCreationContainer>
                                <StyledInput $largeText={true} $width={"200px"} type="text" placeholder="Block Name"
                                             maxLength={18}
                                             onChange={(e) => setBlockName(e.target.value)}/>
                                <PrimaryButton text={"Create Block"} action={addNewBlock}/>
                            </StyledBlockTypeCreationContainer>
                        </> : <div>Select a block type from the list</div>}
                </StyledBlockTypeContainer>
            </StyledCreateBlocksContainer>
        </Popup>
    )
}