import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

export interface BoardProps {
  imageSrc?: string;
  firstName: string;
  lastName: string;
  role: string;
}

const BoardCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  overflow: hidden;
  padding: 20px;  
`;

const BoardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(239, 239, 239, 0.1);
`;

const BoardContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  text-align: left;
`;

const BoardName = styled.h3`
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.4;
  color: #efefef;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const BoardRole = styled.p`
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(239, 239, 239, 0.7);
  margin-top: 4px;
  
  @media (max-width: 768px) {
    font-size: var(--text-xs);
  }
`;

const Board: React.FC<BoardProps> = ({ imageSrc, firstName, lastName, role }) => {
  return (
    <BoardCardWrapper>
      <BoardImageWrapper>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${firstName} ${lastName}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(239, 239, 239, 0.1)' }} />
        )}
      </BoardImageWrapper>
      
      <BoardContent>
        <BoardName>
          {firstName} {lastName}
        </BoardName>
        <BoardRole>{role}</BoardRole>
      </BoardContent>
    </BoardCardWrapper>
  );
};

export default Board;
