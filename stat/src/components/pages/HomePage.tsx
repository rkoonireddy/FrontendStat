import styled from "styled-components";
import logoNoBg from "../../assets/logo-no-bg.png";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";
import {getPreviewData, rawDataExists, previewDataExists, readData, setRawData, resetData, resetPreviewData} from "../../redux/dataSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    resetPipelineData,
    createNewBlock,
    createNewPipeline,
    setFileFrequency
} from "../../redux/pipelineSlice";
import {Popup} from "../pageElements/Popup";
import {StyledInput, StyledUnit} from "../controls/InputControl";
import {PreviewTable} from "../tables/PreviewTable";
import {preProcessCSVData} from "../../util/util";


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
  margin: 0 auto 100px auto;
`;

const StyledHomeContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  width: 100vw;
`;

const StyledContentContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 1.5rem;
  max-width: 50vw;

  & p {
    text-align: justify;
    margin: 20px 50px;
  }
`;

const StyledDividor = styled.div`
  width: 0;
  border-right: 4px solid #73B5B4;
`;

const StyledButtonContainer = styled.div`
  display: flex;
`;

const StyledUploadFileTitle = styled.div`
  font-size: 2rem;
  color: white;
  margin: 15px auto;
`;

const StyledFrequencyInputContainer = styled.div`
  margin: auto;
  max-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

function FileUpload({onClose, onUpload}: { onClose: () => void, onUpload: (frequency: number) => void}) {
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

    
    //edited the rows here as well instead of only handleAccept function.
    const handleUpload = async () => {
        if (file && frequency) {
            const formData = new FormData();
            formData.append('csvFile', file);
    
            const reader = new FileReader();
    
            reader.onload = async (event) => {
                const target = event.target;
                if (target && target.result) {
                    const text = target.result as string;
    
                    // Split the CSV into rows and trim whitespace from each row
                    const rows = text.split("\n").map(row => row.trim()).filter(row => row.length > 0); // Remove completely empty rows
                    
                    // Determine the number of columns (assuming the first row is the header)
                    const numColumns = rows[0]?.split(",").length || 0;
    
                    // Check if the number of columns is less than 2
                    if (numColumns < 2) {
                        alert("The CSV file must contain at least 2 columns.");
                        return; // Stop the upload process if there are fewer than 2 columns
                    }
    
                    // Remove any rows that are completely empty after cleaning
                    const cleanedRows = rows.filter(row => row.split(",").some(cell => cell.trim() !== ''));
    
                    // Check if any value in the first column (timestamp) is missing
                    const firstColumnValues = cleanedRows.map(row => row.split(",")[0]?.trim());
                    const emptyTimestampIndex = firstColumnValues.findIndex(value => value === '');
                    
                    if (emptyTimestampIndex !== -1) {
                        alert(`Detected empty time-stamp value at row ${emptyTimestampIndex}, please ensure that the first column is timestamp and the values are integers.`);
                        return; // Stop the upload process if there are empty timestamp values
                    }
    
                    // Check if any value in the first column (timestamp) from the second row onwards is not an integer
                    const nonIntegerIndex = firstColumnValues.slice(1).findIndex(value => isNaN(parseInt(value)));
                    
                    if (nonIntegerIndex !== -1) {
                        alert(`Found string in timestamp column at row ${nonIntegerIndex + 1}, please ensure that you have only integers starting from the second row.`);
                        return; // Stop the upload process if there are strings in the timestamp column from the second row
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
        <Popup title={"File upload"} onCloseAction={onClose}>
            <StyledInput $width={"300px"} $margin={'20px 0 0 0'} type="file" accept=".csv" onChange={handleFileChange}/>
            <StyledFrequencyInputContainer>
                <StyledInput $largeText={true} type="number" value={frequency}
                             onChange={handleFrequencyChange}/>
                <StyledUnit>HZ</StyledUnit>
            </StyledFrequencyInputContainer>
            {!file || !frequency || !(file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') ? (
                <p style={{ color: 'white' }}>
                    <span>1. Select CSV file</span><br />
                    <span>2. Ensure that the first column is timestamp - integers</span><br />
                    <span>3. We remove empty cells at the end of your file.</span>
                </p>
            ) : (
                <PrimaryButton text={"Preview"} action={handleUpload} />
            )}        
        </Popup>
    )
}

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const dataExists = useAppSelector(rawDataExists);
    const previewData = useAppSelector(getPreviewData);
    const previewDataExistsBool = useAppSelector(previewDataExists);
    const [frequency, setFrequency] = useState(0);
    const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
    const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

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
        dispatch(createNewBlock({ blockType: 'CSVStringLoader', blockName: 'Data loader' }));
    
        // Route to /main
        navigate('/main');
    };
    
    
    

    function handleOnClose() {
        // Reset the previewData in the redux store
        dispatch(resetPreviewData());
        setIsFileUploadOpen(false);
        setIsFilePreviewOpen(false);
    }

    return (
        <StyledHomeContainer>
            <StyledHeader>
                <img src={logoNoBg} alt="Logo"/>
            </StyledHeader>
            <StyledHomeContentContainer>
                <StyledContentContainer>
                    <p>
                        Some text some text some text some text
                        some text some text some text some text
                        some text some text some text some text
                        some text some text some text some text
                        some text some text some text some text
                    </p>
                </StyledContentContainer>
                <StyledDividor/>
                <StyledContentContainer>
                    <p>
                        Upload a small sample of your dataset to experiment
                        with different manipulation and data wrangling
                        approaches!
                    </p>
                    <StyledButtonContainer>
                        <PrimaryButton text={"Upload Sample"} action={() => setIsFileUploadOpen(true)}/>
                        {dataExists ? <PrimaryButton text={"Resume"} action={() => navigate('/main')}/> : null}
                    </StyledButtonContainer>
                </StyledContentContainer>
            </StyledHomeContentContainer>
            {isFileUploadOpen && <FileUpload onClose={handleOnClose} onUpload={handleFileUpload}/>}
            {isFilePreviewOpen && previewDataExistsBool &&
                <Popup title={"File preview"} onCloseAction={handleOnClose} large={true}>
                    <PreviewTable onAccept={handleAccept}></PreviewTable>
                </Popup>
            }
        </StyledHomeContainer>
    )
}