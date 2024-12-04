import {StyledInput} from "../../controls/InputControl";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {Popup} from "./Popup";
import {useEffect, useState} from "react";
import {getBlockTypes} from "../../../service/blockService";
import {createNewBlock, getPipelineModel, updatePipeline} from "../../../redux/pipelineSlice";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import styled from "styled-components";
import {BlockTypeModel} from "../../../types/responseType";

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
    font-size: 2rem;
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
        height: 475px;
        padding: 15px;
        font-family: 'Archivo', sans-serif;
        font-size: 1.25rem;
        overflow-y: scroll;

        ::-webkit-scrollbar {
            display: none;
        }

        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    
    .description-title {
        display: none;
    }
    
    .description-subtitle {
        margin: 25px 0 10px 0;
        font-size: 1.5rem;
    }
    
    .description-main {
        text-align: center;
        margin-bottom: 10px;
    }
    
    .description-normal {
        margin: 10px 0;
        display:flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .description-normal .description-image {
        width: 50%;
    }
    
    b {
        color: #73B5B4;
    }
    
    .description-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
    }
    
    .description-list-item {
        width: 50%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .description-list-item .text {
        margin-bottom: 5px;
    }
    
    img {
        width: 100%;
        height: 100%;
    }
    
    .description-link a {
        font-style: italic;
        color: #73B5B4;
    }

`;

const StyledBlockTypeCreationContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-top: 5px solid #ffffff30;
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
        <Popup title={"Create Block"} onCloseAction={onCloseAction} noPadding={true} large={true}>
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
                            <StyledBlockTypeCreationContainer>
                                <StyledInput $largeText={true} $width={"200px"} type="text" placeholder="Block Name" $margin={"0 auto"}
                                             maxLength={18}
                                             onChange={(e) => setBlockName(e.target.value)}/>
                                <PrimaryButton text={"Create Block"} action={addNewBlock} disabled={!blockName}/>
                            </StyledBlockTypeCreationContainer>
                        </> : <div>Select a block type from the list</div>}
                </StyledBlockTypeContainer>
            </StyledCreateBlocksContainer>
        </Popup>
    )
}