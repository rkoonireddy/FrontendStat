import React, { useRef, useEffect, useState } from "react";
import { ReactComponent as ScrollRightSVG } from "../../assets/chevron-compact-right.svg";
import { ReactComponent as ScrollLeftSVG } from "../../assets/chevron-compact-left.svg";
import styled from "styled-components";

const StyledSliderContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;

    & svg:hover {
        scale: 1.05;
        cursor: pointer;
    }
`;

const StyledSlider = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    scroll-behavior: smooth;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

export function HorizontalScrollContainer({ id, children }: { id: string, children: React.ReactNode }) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const handleResize = () => {
                setShowScrollButtons(slider.scrollWidth > slider.clientWidth);
            };

            handleResize();
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    function slideLeft() {
        const slider = sliderRef.current;
        if (slider) {
            slider.scrollLeft -= 200;
        }
    }

    function slideRight() {
        const slider = sliderRef.current;
        if (slider) {
            slider.scrollLeft += 200;
        }
    }

    return (
        <StyledSliderContainer>
            {showScrollButtons && (
                <ScrollLeftSVG onClick={slideLeft} style={{ width: "40px", height: "40px", color: "#73b5b4" }} />
            )}
            <StyledSlider id={id} ref={sliderRef}>
                {children}
            </StyledSlider>
            {showScrollButtons && (
                <ScrollRightSVG onClick={slideRight} style={{ width: "40px", height: "40px", color: "#73b5b4" }} />
            )}
        </StyledSliderContainer>
    );
}