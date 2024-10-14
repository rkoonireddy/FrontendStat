import styled from "styled-components";
import {MiniPopup, Popup} from "./Popup";

const StyledMessage = styled.div`
  font-size: 0.9rem;
  color: white;
  margin: 15px auto;
  font-family: consolas, monospace;
  text-align: center;
  white-space: pre-line;
`;

export function ControlsChangedPopup({ text, onCloseAction }: { text: string; onCloseAction: () => void }) {
    return (
        <MiniPopup title={`Input changed to ${text}`} onCloseAction={onCloseAction}>
            <StyledMessage>Press "APPLY" to confirm new parameters</StyledMessage>
        </MiniPopup>
    )
}