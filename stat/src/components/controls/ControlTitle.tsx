import styled from "styled-components";
import {useEffect, useState} from "react";

export const StyledControlTitle = styled.div<{ $margin?: string, $smallText?: boolean }>`
  font-size: ${props => props.$smallText ? '1rem' : '1.25rem'};
  display: flex;
  justify-content: center;
  color: #ffffff;
  margin-bottom: ${props => props.$margin ? props.$margin : 'auto'};;
`;

export function ControlTitle({title, margin}: { title: string, margin?: string }) {
    const [formattedTitle, setFormattedTitle] = useState(title);
    const [smallText, setSmallText] = useState(false);

    useEffect(() => {
        setSmallText(title.length > 10);
        setFormattedTitle(title.replace(/_/g, " "));
    }, [title]);

    return (
        <StyledControlTitle $margin={margin} $smallText={smallText}>{formattedTitle}</StyledControlTitle>
    )
}