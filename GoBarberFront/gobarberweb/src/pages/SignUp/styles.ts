import styled, { keyframes } from 'styled-components';

import signUpBackground from '../../assets/sign-up-background.png';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  background: linear-gradient(135deg, #17151b 0%, #312e38 45%, #1f1c24 100%);

  @media (max-width: 900px) {
    display: block;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 720px;
  padding: 48px 32px;

  @media (max-width: 900px) {
    max-width: none;
    min-height: 100vh;
  }

  @media (max-width: 560px) {
    padding: 24px 16px;
  }
`;

const appearFromRight = keyframes `
  from {
    opacity: 0;
    transform: translateX(32px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: min(100%, 500px);
  padding: 40px;
  border-radius: 32px;
  background: rgba(18, 16, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(18px);
  gap: 28px;
  animation: ${appearFromRight} 1s;

  > img {
    width: 176px;
  }

  form {
    width: 100%;
  }

  @media (max-width: 560px) {
    padding: 28px 22px;
    border-radius: 24px;
    gap: 24px;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  span {
    color: #ff9000;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    font-size: 38px;
    line-height: 1.1;
    color: #f4ede8;
  }

  p {
    color: #b9b3c2;
    font-size: 16px;
    line-height: 1.65;
  }

  @media (max-width: 560px) {
    h1 {
      font-size: 30px;
    }
  }
`;

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  span {
    color: #b9b3c2;
  }

  a {
    color: #f4ede8;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 14px;
    background: rgba(255, 144, 0, 0.12);
    border: 1px solid rgba(255, 144, 0, 0.18);
    transition: background 0.2s, transform 0.2s;

    svg {
      flex-shrink: 0;
    }

    &:hover {
      background: rgba(255, 144, 0, 0.18);
      transform: translateX(-3px);
    }
  }

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;

    a {
      justify-content: center;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 56px;
  background:
    linear-gradient(180deg, rgba(12, 11, 15, 0.12), rgba(12, 11, 15, 0.86)),
    url(${signUpBackground}) no-repeat center;
  background-size: cover;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 60px auto auto 58px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 144, 0, 0.24), transparent 70%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto 52px 56px auto;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.12), transparent 70%);
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const BackgroundContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 470px;
  padding: 32px;
  border-radius: 28px;
  background: rgba(16, 14, 20, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);

  > span {
    color: #ffd08a;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h2 {
    margin-top: 18px;
    font-size: 36px;
    line-height: 1.12;
    color: #fff;
  }
`;

export const HighlightList = styled.ul`
  list-style: none;
  margin-top: 28px;
  display: grid;
  gap: 14px;

  li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);

    svg {
      color: #ff9000;
      flex-shrink: 0;
    }

    strong {
      display: block;
      color: #fff;
      font-size: 15px;
    }

    p {
      margin-top: 4px;
      color: #c8c2d3;
      font-size: 14px;
      line-height: 1.5;
    }
  }
`;

export const StatCard = styled.div`
  margin-top: 24px;
  padding: 22px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(255, 144, 0, 0.18), rgba(255, 144, 0, 0.06));
  border: 1px solid rgba(255, 144, 0, 0.22);

  strong {
    display: block;
    color: #fff;
    font-size: 38px;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 8px;
    color: #f7d8ab;
    line-height: 1.5;
  }
`;
