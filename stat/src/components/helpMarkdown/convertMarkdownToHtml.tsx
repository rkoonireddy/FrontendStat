import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import './MarkdownViewerStyles.css';
import {ReactComponent as CloseSVG} from '../../assets/x.svg';

const StyledPopupContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2e2e2e;
  color: #f5f5f5;
  padding: 0px;
  border: 2px solid #73b5b4;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  z-index: 1001;
  width: 70%;
  max-width: 1000px;
  max-height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 0px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #73b5b4;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5ea09f;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  &::-webkit-scrollbar-track:hover {
    background: #333;
  }
`;

const StyledCloseIcon = styled(CloseSVG)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  fill: #73b5b4;
  transition: fill 0.3s;
  z-index: 1002;

  &:hover {
    fill: red;
  }
`;

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(4px);
`;



type HelpPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface ExtendedToken {
    type: string;
    tag: string;
    attrs: [string, string][] | null;
    attrIndex(name: string): number;
    attrPush(attr: [string, string]): void;
    attrSet(name: string, value: string): void;
    attrJoin(name: string, value: string): void;
    content: string;
    children: ExtendedToken[] | null;
    markup: string;
    info: string;
    meta: any;
    block: boolean;
    level: number;
    nesting: number;
  }
  

const MarkdownViewer: React.FC<HelpPopupProps> = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>(''); 

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch('/help_stat/help_markdown/markdownFile.md');
        const markdownText = await response.text();
        setMarkdownContent(markdownText);
      } catch (error) {
        console.error('Error fetching markdown:', error);
      }
    };

    if (isOpen) {
      fetchMarkdown();
    }
  }, [isOpen]);


  useEffect(() => {
    if (markdownContent) {
      const md = new MarkdownIt();
  

      md.renderer.rules.link_open = (
        tokens: ExtendedToken[],
        idx: number,
        options: any,
        env: any,
        self: any
      ): string => {
        const token = tokens[idx];
  

        if (token.attrs) {
          const hrefIndex = token.attrIndex('href');
          if (hrefIndex >= 0) {
            const href = token.attrs[hrefIndex][1];
            if (href.startsWith('http')) {
              token.attrPush(['target', '_blank']);
              token.attrPush(['rel', 'noopener noreferrer']);
            } else {
              const targetIndex = token.attrIndex('target');
              if (targetIndex >= 0) {
                token.attrs.splice(targetIndex, 1); 
              }
            }
          }
        }
  
        return self.renderToken(tokens, idx, options);
      };
  
      const rawHtml = md.render(markdownContent);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      setHtmlContent(sanitizedHtml);
    }
  }, [markdownContent]);
  
  if (!isOpen) return null;

  return (
    <>
      <StyledOverlay onClick={onClose} />
      <StyledPopupContainer>
        <StyledCloseIcon onClick={onClose} />
        <StyledContent>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </StyledContent>
      </StyledPopupContainer>
    </>
  );
};

export default MarkdownViewer;
