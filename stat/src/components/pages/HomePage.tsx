import styled from "styled-components";
import logoNoBg from "../../assets/logo-no-bg.png";
import {PrimaryButton} from "../buttons/PrimaryButton";
import {useNavigate} from "react-router-dom";
import {ChangeEvent, useRef, useState} from "react";
import {rawDataExists, readData} from "../../redux/dataSlice";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {
    createNewBlock,
    createNewPipeline,
    getActiveBlock,
    getActiveBlockId,
    setFileFrequency
} from "../../redux/pipelineSlice";


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

function FileUpload({onClose}: { onClose: () => void }) {
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

    const handleUpload = () => {
        if(file && frequency) {
            const formData = new FormData();
            formData.append('csvFile', file);
            dispatch(readData(formData) as any);
            dispatch(createNewPipeline());
            dispatch(setFileFrequency(frequency));
            dispatch(createNewBlock({ blockType: 'CSVStringLoader', blockName: 'Data loader'}));
            navigate('/main');
            onClose();
        }
    }
}

export default function HomePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dataExists = useAppSelector(rawDataExists);
    const activeBlockId = useAppSelector(getActiveBlock);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('csvFile', file);
            dispatch(readData(formData) as any);
        }
        // create pipeline
        dispatch(createNewPipeline());
        // create first block
        dispatch(createNewBlock({blockType: 'CSVStringLoader', blockName: 'Data loader'}));

        navigate('/main');
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

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
                        <PrimaryButton text={"Upload Sample"} action={handleButtonClick}/>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: 'none'}}
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                        {dataExists ? <PrimaryButton text={"Resume"} action={() => navigate('/main')}/> : null}
                    </StyledButtonContainer>
                </StyledContentContainer>
            </StyledHomeContentContainer>
        </StyledHomeContainer>
    )
}