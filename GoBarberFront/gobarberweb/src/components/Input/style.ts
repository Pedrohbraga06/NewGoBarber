import styled, { css } from 'styled-components';
import { ReactNode } from 'react';
import Tooltip from '../Tooltip';

interface ErrorProps {
  title: string;
  children: ReactNode;
}

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: rgba(35, 33, 41, 0.96);
  border-radius: 14px;
  padding: 18px 16px;
  width: 100%;
  min-height: 58px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #8f8898;
  display: flex;
  align-items: center;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s, color 0.2s;

  & + div {
    margin-top: 10px;
  }

  ${(props) => props.isErrored
    && css`
      border-color: #c53030;
      box-shadow: 0 0 0 4px rgba(197, 48, 48, 0.08);
    `}

  ${(props) => props.isFocused
    && css`
      color: #ff9000;
      border-color: #ff9000;
      box-shadow: 0 0 0 4px rgba(255, 144, 0, 0.12);
      transform: translateY(-1px);
    `}

  ${(props) => props.isFilled
    && css`
      color: #ff9000;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;
    font-size: 16px;

    &::placeholder {
      color: #8f8898;
    }
  }

  svg {
    margin-right: 14px;
  }
`;

export const Error = styled(Tooltip)<ErrorProps>`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
