import React from "react";
import {Popup} from "./Popup";

type HelpPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const HelpPopup: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
        <Popup title={"Help and Examples"} onCloseAction={onClose} large={true} noPadding={false}>
        <iframe
          src="help_stat/help_html/help_popup.html"
          title="ECG Data"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            marginTop: "10px",
          }}
        />
        </Popup>
    </>
  );
};
