/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  height: 58px;
  border-radius: 14px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  box-shadow: 0 18px 35px rgba(255, 144, 0, 0.25);
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${shade(0.2, '#ff9000')};
    transform: translateY(-2px);
    box-shadow: 0 22px 40px rgba(255, 144, 0, 0.3);
  }

  &:focus-visible {
    box-shadow:
      0 0 0 4px rgba(255, 144, 0, 0.2),
      0 18px 35px rgba(255, 144, 0, 0.25);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
