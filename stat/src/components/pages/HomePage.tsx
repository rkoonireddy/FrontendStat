import styled from "styled-components";
import logoNoBg from "../../assets/logo-no-bg.png";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useState} from "react";
import {rawDataExists, readData, resetData} from "../../redux/dataSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    createNewBlock,
    createNewPipeline, resetPipelineData,
    setFileFrequency
} from "../../redux/pipelineSlice";
import {Popup} from "../pageElements/Popup";
import {StyledInput, StyledUnit} from "../controls/InputControl";


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

function FileUpload({onClose}: { onClose: (arg0: boolean) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [frequency, setFrequency] = useState<number>(0);
    const navigate = useNavigate();
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
            console.log("resetData");
            dispatch(resetData());
            console.log("resetPipelineData");
            dispatch(resetPipelineData());
            console.log("readData");
            console.log(formData);
            dispatch(readData(formData) as any);
            // console.log("createNewPipeline");
            // await dispatch(createNewPipeline());
            // console.log("setFileFrequency");
            // dispatch(setFileFrequency(frequency));
            // console.log("createNewBlock");
            // dispatch(createNewBlock({blockType: 'CSVStringLoader', blockName: 'Data loader'}));
            // navigate('/main');
        }
    }

    return (
        <Popup title={"File upload"} showPopup={onClose}>
            <StyledInput $width={"300px"} $margin={'20px 0 0 0'} type="file" accept=".csv" onChange={handleFileChange}/>
            <StyledFrequencyInputContainer>
                <StyledInput $largeText={true} type="number" value={frequency}
                             onChange={handleFrequencyChange}/>
                <StyledUnit>HZ</StyledUnit>
            </StyledFrequencyInputContainer>
            <PrimaryButton text={"Upload"} action={handleUpload} disabled={!file || !frequency}/>
        </Popup>
    )
}

export default function HomePage() {
    const navigate = useNavigate();
    const dataExists = useAppSelector(rawDataExists);
    const [isPopupOpen, setIsPopupOpen] = useState(false);


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
                        <PrimaryButton text={"Upload Sample"} action={() => setIsPopupOpen(true)}/>
                        {dataExists ? <PrimaryButton text={"Resume"} action={() => navigate('/main')}/> : null}
                    </StyledButtonContainer>
                </StyledContentContainer>
            </StyledHomeContentContainer>
            {isPopupOpen && <FileUpload onClose={setIsPopupOpen}/>}
        </StyledHomeContainer>
    )
}