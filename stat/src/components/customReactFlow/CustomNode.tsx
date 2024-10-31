import React from 'react';
import styled from 'styled-components';
import {Handle, Position} from '@xyflow/react';
import {CustomNodeProps} from "../../types/nodeTypes";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    deleteBlockFromPipeline,
    getActiveBlockId,
    getPipelineModel,
    setActiveBlockId
} from "../../redux/pipelineSlice";
import {ReactComponent as TrashSVG} from "../../assets/trash3-fill.svg";
import {ReactComponent as InfoSVG} from "../../assets/info-circle-fill.svg"
import { ReactComponent as CloseSVG } from '../../assets/close-circle-svgrepo-com.svg';
import {useState} from 'react';

export const StyledNodeContainer = styled.div<{ $active?: boolean }>`
    padding: 5px;
    border: 1px solid ${props => !props.$active ? '#73B5B4' : '#73B5B4'};
    border-radius: 5px;
    background: ${props => props.$active ? '#eeede9' : 'linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%)'};
    position: relative;
    width: 100px;
    min-height: 25px;
    text-align: center;
`;

export const StyledNodeLabel = styled.div<{ $active?: boolean, $small?: boolean }>`
    font-size: ${props => (props.$small ? '0.5rem' : '0.75rem')};
    font-weight: normal;
    color: ${props => !props.$active ? '#ffffff' : '#73B5B4'};
`;

export const StyledNodeType = styled.div`
    font-size: 5px;
    position: absolute;
    bottom: 0;
    right: 3px;
    color: #888;
`;

export const StyledTag = styled.div`
    font-size: 5px;
    position: fixed;
    bottom: -4px;
    left: 3px;
    color: #888;
`;

export const StyledDeleteButton = styled.div`
    position: absolute;
    top: -5px;
    right: 3px;
    opacity: 0.25;

    &:hover {
        cursor: pointer;
        opacity: 0.8;
    }
`;

// export const StyledRunButton = styled.div`
//     position: absolute;
//     top: -1px;
//     right: -1px;
//     opacity: 0.25;

//     &:hover {
//         cursor: pointer;
//         opacity: 0.8;
//     }
// `;

export const StyledNodeInfoIcon = styled(InfoSVG)`
    position: absolute;
    top: 2px;
    left: 3px;
    width: 7px;
    height: 7px;
    // opacity: 0.25;
    color: 	#989898; //grey
    &:hover {
        cursor: pointer;
        opacity: 0.8;
        color: #0056b3; 
    }
`;    

export const StyledPopup = styled.div<{ $visible: boolean }>`
    position: overlay; 
    top: 15px; // Overlay positioning
    left: 50px; 
    font-size: 0.5vw; // Adjust font size as necessary
    background-color: #f5fffa;
    color: black;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    width: 200px; 
    max-height: 250px; // Set max height
    overflow-y: auto; // Enable vertical scrolling
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
    transition: opacity 0.3s ease; 
    opacity: ${({ $visible }) => ($visible ? 1 : 0)}; 
    animation: ${({ $visible }) => ($visible ? 'fadeIn 0.3s' : 'none')};

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Scrollbar styles for WebKit browsers */
    &::-webkit-scrollbar {
        width: 8px; /* Width of the scrollbar */
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1; /* Color of the scrollbar track */
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb {
        background: #888; /* Color of the scrollbar thumb */
        border-radius: 10px; /* Rounded corners */
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; /* Darker color on hover */
    }
`;

export const StyledCloseInfoIcon = styled(CloseSVG)`
    position: fixed; // Correct positioning
    top: 25px; // Adjust position as needed
    left: 185px; // Adjust position as needed
    width: 10px;
    height: 10px;
    opacity: 0.5;
    // z-index: 100; // Ensures the icon appears above other content
    &:hover {
        cursor: pointer; // Shows a pointer cursor on hover
        opacity: 0.8; // Increases opacity on hover for a visual effect
    }
`;

const CustomNode = ({data}: CustomNodeProps) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const pipeline = useAppSelector(getPipelineModel);
    const dispatch = useAppDispatch();
    const activeNodeId = useAppSelector(getActiveBlockId);

    const togglePopup = () => {
        setPopupVisible(prev => !prev);
    };

    return (
        <StyledNodeContainer $active={data.id === activeNodeId} onClick={() => dispatch(setActiveBlockId(data.id))}>
            <Handle type="target" position={Position.Top} />
            <StyledDeleteButton title={"Delete Block"} onClick={(e) => {
                dispatch(deleteBlockFromPipeline({pipelineId: pipeline.id, blockId: data.id}));
                e.stopPropagation(); // Prevents closing due to parent clicks
            }}>
                <TrashSVG style={{width: "7px", height: "7px", color: "#ff0000"}}/>
            </StyledDeleteButton>
            <StyledNodeLabel $active={data.id === activeNodeId} $small={data.label.length > 14}>
                {data.label}
            </StyledNodeLabel>
            <StyledNodeType>{data.type}</StyledNodeType>
            <Handle type="source" position={Position.Bottom} />
            <StyledNodeInfoIcon 
                title={"More information"} 
                onClick={(e) => {
                    e.stopPropagation(); // Prevents closing due to parent clicks
                    dispatch(setActiveBlockId(data.id)); // Set active block ID
                    togglePopup(); // Toggle the popup visibility
                }}
            >
                <InfoSVG />
            </StyledNodeInfoIcon>
            <StyledPopup $visible={isPopupVisible}>
                <StyledCloseInfoIcon onClick={(e) => {
                    e.stopPropagation(); // Prevents closing due to parent clicks
                    setPopupVisible(false); // Close the popup
                    dispatch(setActiveBlockId(data.id)); // Set active block ID
                }}>
                    <CloseSVG />
                </StyledCloseInfoIcon>
                {activeNodeId}
                <p>
                    The earliest known appearance of the phrase was in The Boston Journal. 
                    In an article titled "Current Notes" in the February 9, 1885, edition, the phrase is mentioned as a good practice sentence for writing students:
                    "A favorite copy set by writing teachers for their pupils is the following, because it contains every letter of the alphabet: 
                    'A quick brown fox jumps over the lazy dog.'"[1] Dozens of other newspapers published the phrase over the next few months, all using the 
                    version of the sentence starting with "A" rather than "The".[2] The earliest known use of the phrase starting with "The" is from the 1888 book 
                    Illustrative Shorthand by Linda Bronson.[3] 
                    The modern form (starting with "The") became more common even though it is two letters longer than the original (starting with "A").
                    A 1908 edition of the Los Angeles Herald Sunday Magazine records that when the New York Herald was equipping an office with typewriters 
                    "a few years ago", staff found that the common practice sentence of "now is the time for all good men to come to the aid of the party" 
                    did not familiarize typists with the entire alphabet, and ran onto two lines in a newspaper column. They write that a staff member 
                    named Arthur F. Curtis invented the "quick brown fox" pangram to address this.[4]
                    
                    Pictorial depiction of the pangram from Scouting for Boys (1908)[5]
                    As the use of typewriters grew in the late 19th century, the phrase began appearing in typing lesson books as a 
                    practice sentence. Early examples include How to Become Expert in Typewriting: A Complete Instructor Designed Especially 
                    for the Remington Typewriter (1890),[6] and Typewriting Instructor and Stenographer's Hand-book (1892). By the turn of the 
                    20th century, the phrase had become widely known. In the January 10, 1903, issue of Pitman's Phonetic Journal, it is referred 
                    to as "the well known memorized typing line embracing all the letters of the alphabet".[7] Robert Baden-Powell's book Scouting 
                    for Boys (1908) uses the phrase as a practice sentence for signaling.[5]
                    
                    The first message sent on the Moscow–Washington hotline on August 30, 1963, was the test phrase "THE QUICK BROWN FOX JUMPED 
                    OVER THE LAZY DOG'S BACK 1234567890".[8] Later, during testing, the Russian translators sent a message asking their 
                    American counterparts, "What does it mean when your people say 'The quick brown fox jumped over the lazy dog'?"[9]
                    
                    During the 20th century, technicians tested typewriters and teleprinters by typing the sentence.[10]

                    It is the sentence used in the annual Zaner-Bloser National Handwriting Competition, a cursive writing competition which has been held in the U.S. since 1991.[11][12]
                </p>
            </StyledPopup>
            <StyledTag>
                <p> Styled Tag</p>
            </StyledTag>
        </StyledNodeContainer>
    );
};

export default CustomNode;