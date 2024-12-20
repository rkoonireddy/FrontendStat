import styled from "styled-components";
import logoNoBg from "../../assets/logo-no-bg.png";
import {useNavigate} from "react-router-dom";
import React, {ChangeEvent, useState} from "react";
import {
    getPreviewData,
    previewDataExists,
    readData,
    setRawData,
    resetData,
    resetPreviewData
} from "../../redux/dataSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    getPipelineId,
    resetPipelineData,
    setFileFrequency,
    setError,
} from "../../redux/pipelineSlice";
import {StyledInput, StyledUnit} from "../controls/InputControl";
import {PreviewTable} from "../tables/PreviewTable";
import {checkFileValidity, preProcessCSVData} from "../../util/fileUtil";
import {unwrapResult} from '@reduxjs/toolkit';
import {Popup} from "../pageElements/popups/Popup";
import {PrimaryButton} from "../pageElements/buttons/PrimaryButton";
import {ErrorPopup} from "../pageElements/popups/ErrorPopup";
import {Loading} from "../pageElements/Loading";
import {
    createNewBlock,
    createNewPipeline,
    updatePipeline
} from "../../redux/pipelineThunk";
import {fetchPipeline} from "../../service/pipelineService";
import {ReactComponent as ExamplesSVG} from "../../assets/examples.svg";
import { HelpPopup } from "./HelpPage";

const StyledHomeContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom right, #3D3D3D 0%, #000000 100%);
    color: white;
`;

const StyledHeader = styled.div`
    width: 500px;
    display: flex;
    justify-content: center;
    margin: 0 auto 0 auto;
`;

const StyledHomeContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: fit-content;
    width: 100vw;
`;

const StyledWelcomeContentContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 1.5rem;
    max-width: 75vw;
    margin: 0 auto;

    & p {
        text-align: center;
        margin: 20px 50px;
    }
`;

const StyledActionContentContainer = styled.div`
    display: flex;
    justify-content: space-evenly;

`;

const StyledContentContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 1.5rem;
    max-width: 50vw;

    & p {
        text-align: center;
        margin: 20px 50px;
    }
`;

const StyledVerticalDividor = styled.div`
    width: 0;
    border-right: 4px solid #73B5B4;
`;

const StyledHorizontalDividor = styled.div`
    height: 0;
    border-bottom: 4px solid #73B5B4;
    width: 75vw;
    margin: 25px auto;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    margin: 0 50px;
`;

const StyledFrequencyInputContainer = styled.div`
    margin: auto;
    max-width: 150px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const StyledFileUploadInfo = styled.p`
    color: white;
    margin-top: 10px;
`;

const StyledFileUploadInfoSpan = styled.span`
    display: inline-block;
    margin: 8px 0;
`;

function FileUpload({onClose, onUpload}: { onClose: () => void, onUpload: (frequency: number) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState<number>(0);
    const dispatch = useAppDispatch();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
        }
    }

    const handleFrequencyChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFrequency(parseInt(event.target.value));
    }

    const handleUpload = async () => {
        if (file && frequency) {
            const formData = new FormData();
            formData.append('csvFile', file);

            const reader = new FileReader();

            reader.onload = async (event) => {
                const target = event.target;
                if (target && target.result) {
                    const text = target.result as string;

                    const {isValid, message} = await checkFileValidity(text);

                    if (!isValid) {
                        alert(message);
                        return;
                    }

                    // Proceed with the upload if no empty rows or invalid values are found
                    try {
                        // Optionally set the cleaned data to formData or other logic
                        await dispatch(readData(formData) as any).unwrap();
                        onUpload(frequency);
                    } catch (error) {
                        console.error("File upload failed:", error);
                    }
                }
            };

            reader.readAsText(file);
        }
    };

    return (
        <Popup title={"File upload"} onCloseAction={onClose} large={false}>
            <StyledInput $width={"300px"} $margin={'20px 0 0 0'} type="file" accept=".csv" onChange={handleFileChange}/>
            <StyledFrequencyInputContainer>
                <StyledInput $largeText={true} type="number" value={frequency}
                             onChange={handleFrequencyChange}/>
                <StyledUnit>HZ</StyledUnit>
            </StyledFrequencyInputContainer>
            {!file || !frequency || !(file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') ? (null) : (
                <PrimaryButton text={"Preview"} action={handleUpload}/>
            )}
            <StyledFileUploadInfo>
                <StyledFileUploadInfoSpan>- Select CSV file. It must have a header</StyledFileUploadInfoSpan><br/>
                <StyledFileUploadInfoSpan>- The first column will be the index</StyledFileUploadInfoSpan><br/>
                <StyledFileUploadInfoSpan>- Make sure it contains only integers and no missing
                    values</StyledFileUploadInfoSpan><br/>
                <StyledFileUploadInfoSpan>- Make sure the remaining columns only contain valid numbers or NA
                    (empty)</StyledFileUploadInfoSpan><br/>
            </StyledFileUploadInfo>
        </Popup>
    )
}

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const existingPipelineId = useAppSelector(getPipelineId);
    const previewData = useAppSelector(getPreviewData);
    const previewDataExistsBool = useAppSelector(previewDataExists);
    const [frequency, setFrequency] = useState(0);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
    const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
    const [pipelineIdToLoad, setPipelineIdToLoad] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileUpload = (frequency: number) => {
        setFrequency(frequency);
        setIsFileUploadOpen(false);
        setIsFilePreviewOpen(true);
    }

    const handleAccept = async (selectedColumns: string[]) => {
        // First reset rawData and pipelineData
        dispatch(resetData());
        dispatch(resetPipelineData());

        const cleanedData = preProcessCSVData(previewData, selectedColumns);

        // Update the rawData in the redux store
        dispatch(setRawData(cleanedData));

        // Create pipeline and block
        await dispatch(createNewPipeline());
        dispatch(setFileFrequency(frequency));
        dispatch(createNewBlock({blockType: 'CSVStringLoader', blockName: 'Data loader'}));

        navigate('/main');
    };

    async function handlePipelineLoad(pipelineId: string = 'not set') {
        setLoading(true);

        if (pipelineId === 'not set') dispatch(resetData());

        const existingPipelineId: string = pipelineId === 'not set' ? pipelineIdToLoad : pipelineId;

        try {
            await fetchPipeline({pipelineId: existingPipelineId});

            await dispatch(updatePipeline({pipelineId: existingPipelineId, resetPipeline: pipelineId === 'not set'}));

            navigate('/main');

            return;
        } catch (error) {
            console.error("Error loading pipeline:", error);
            setPipelineIdToLoad("");
            setLoading(false);
            const errorMessage = JSON.parse((error as Error).message).detail || "Error loading pipeline";
            dispatch(setError(errorMessage));
        }
    }

    function handleOnClose() {
        // Reset the previewData in the redux store
        dispatch(resetPreviewData());
        setIsFileUploadOpen(false);
        setIsFilePreviewOpen(false);
    }

    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const toggleHelpPopup = () => {
      setIsHelpOpen(!isHelpOpen);
    };

    return (
        <StyledHomeContainer>
            {loading && <Loading/>}
            <StyledHeader>
                <img src={logoNoBg} alt="Logo" style={{ width: "1000px", height: "400px"}}/>
            </StyledHeader>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ExamplesSVG
                    onClick={toggleHelpPopup}
                    title="Help and Examples"
                    style={{
                        width: "30px",
                        height: "30px",
                        fill: "#73B5B4",
                        cursor: "pointer",
                    }}
                />
            </div>

            <HelpPopup isOpen={isHelpOpen} onClose={toggleHelpPopup} />

            <ErrorPopup/>
            <StyledHomeContentContainer>

                <StyledWelcomeContentContainer>
                    <p>
                        Welcome to the Statistical Timeseries Analysis Toolkit! <br/> This is a web-based tool for
                        building and visualizing data processing pipelines using the python based stat library.
                        Get started by uploading your data and creating a pipeline!
                    </p>
                </StyledWelcomeContentContainer>
                <StyledHorizontalDividor/>
                <StyledActionContentContainer>
                    <StyledContentContainer>
                        <p>
                            Upload a small sample of your dataset to experiment
                            with different manipulation and data wrangling
                            approaches!
                        </p>
                        <StyledButtonContainer>
                            <PrimaryButton text={"Upload Sample"} action={() => setIsFileUploadOpen(true)}/>
                            {
                                existingPipelineId?.length > 0 ?
                                    <PrimaryButton text={"Resume"}
                                                   action={() => {
                                                       handlePipelineLoad(existingPipelineId).then()
                                                   }}/> :
                                    null
                            }
                        </StyledButtonContainer>
                    </StyledContentContainer>
                    <StyledVerticalDividor/>
                    <StyledContentContainer>
                        <p>
                            Already worked on a pipeline and still have its ID? Load it here!
                        </p>
                        <StyledButtonContainer>
                            <PrimaryButton text={"Load Pipeline"} action={() => {
                                handlePipelineLoad().then()
                            }} disabled={pipelineIdToLoad === ""}/>
                            <StyledInput
                                $width={"500px"}
                                $margin={'auto'}
                                value={pipelineIdToLoad}
                                onChange={(e) => setPipelineIdToLoad(e.target.value.trim())}
                                placeholder="Enter pipeline ID"
                            />
                        </StyledButtonContainer>
                    </StyledContentContainer>
                </StyledActionContentContainer>
            </StyledHomeContentContainer>
            {
                isFileUploadOpen && <FileUpload onClose={handleOnClose} onUpload={handleFileUpload}/>
            }
            {
                isFilePreviewOpen && previewDataExistsBool &&
                <Popup title={"File preview"} onCloseAction={handleOnClose} large={true}>
                    <PreviewTable onAccept={handleAccept}></PreviewTable>
                </Popup>
            }
        </StyledHomeContainer>
    )
}