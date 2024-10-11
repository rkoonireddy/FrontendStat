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
                        alert(`Found empty value in the first column at row ${emptyTimestampIndex}, please ensure that the first column only contains valid integers. This is the row:\n${cleanedRows[emptyTimestampIndex]}`);
                        return; // Stop the upload process if there are empty timestamp values
                    }
    
                    // Check if any value in the first column (timestamp) from the second row onwards is not an integer
                    const nonIntegerIndex = firstColumnValues.slice(1).findIndex(value => {
                        const parsedFloat = parseFloat(value); // First try to convert to float
                        const isValidFloat = !isNaN(parsedFloat); // Check if valid float
                        if (!isValidFloat) return true; // If not valid float, return true
                        
                        return !Number.isInteger(parsedFloat); // Then check if it is also a valid integer

                    });
                    
                    if (nonIntegerIndex !== -1) {
                        alert(`Found non-integer string in the first column at row ${nonIntegerIndex + 1} with value '${firstColumnValues.slice(1)[nonIntegerIndex]}', please ensure that the first column only contains valid integers. This is the row:\n${cleanedRows[nonIntegerIndex + 1]}`);
                        return; // Stop the upload process if there are strings in the timestamp column from the second row
                    }

                    // Also check if any value in the columns 2 to N are not numbers
                    const nonNumberIndex = cleanedRows.slice(1).findIndex(row => {
                        const values = row.split(",").slice(1);
                        // Each value must either be valid number or empty
                        const isValid = values.every(value => {
                            const cleanedValue = value.trim();  // Remove any surrounding whitespace, e.g. "\r"
                            return cleanedValue === "" || !isNaN(parseFloat(cleanedValue));  // Check if it's not empty and also not a number
                        })

                        return !isValid;
                    });

                    if (nonNumberIndex !== -1) {
                        alert(`Found non-number value in one of the value columns at row ${nonNumberIndex + 1}, please ensure that the second to N columns only contain valid numbers or empty (missing) values. This is the row:\n${cleanedRows[nonNumberIndex + 1]}`);
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
        <Popup title={"File upload"} onCloseAction={onClose} large={false}>
            <StyledInput $width={"300px"} $margin={'20px 0 0 0'} type="file" accept=".csv" onChange={handleFileChange}/>
            <StyledFrequencyInputContainer>
                <StyledInput $largeText={true} type="number" value={frequency}
                             onChange={handleFrequencyChange}/>
                <StyledUnit>HZ</StyledUnit>
            </StyledFrequencyInputContainer>
            {!file || !frequency || !(file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') ? (null) : (
                <PrimaryButton text={"Preview"} action={handleUpload} />
            )}
            <p style={{ color: 'white', marginTop: "10px" }}>
                <span style={{ display: 'inline-block', margin: "8px 0" }}>- Select CSV file. It must have a header</span><br />
                <span style={{ display: 'inline-block', margin: "8px 0" }}>- The first column will be the index</span><br />
                <span style={{ display: 'inline-block', margin: "8px 0" }}>- Make sure it contains only integers and no missing values</span><br />
                <span style={{ display: 'inline-block', margin: "8px 0" }}>- Make sure the remaining columns only contain valid numbers or NA (empty)</span><br />
            </p>   
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