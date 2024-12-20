import React from "react";
import styled from "styled-components";

const StyledPopupContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1000;
  width: 80%;
  height: 80%;
`;

const StyledCloseButton = styled.button`
  padding: 5px 10px;
  background: #73b5b4;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

type HelpPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <StyledPopupContainer>
        <iframe
          src="help_stat/help_html/help_popup.html"
          title="ECG Data"
          style={{
            width: "100%",
            height: "calc(100% - 80px)",
            border: "none",
            marginTop: "10px",
          }}
        />
        <StyledCloseButton onClick={onClose}>Close</StyledCloseButton>
      </StyledPopupContainer>
      <StyledOverlay onClick={onClose} />
    </>
  );
};
