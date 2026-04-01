import styled, { css } from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #17151b 0%, #201d26 38%, #151319 100%);
`;

export const Header = styled.header`
  padding: 28px 32px 0;

  @media (max-width: 768px) {
    padding: 20px 16px 0;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 28px;
  border-radius: 28px;
  background: rgba(18, 16, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 920px) {
    flex-wrap: wrap;
    padding: 20px;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  > img {
    width: 84px;
    height: 84px;
    object-fit: cover;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span {
    color: #ff9000;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    color: #f4ede8;
    font-size: 20px;
    line-height: 1.2;
  }
`;

export const Profile = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  span {
    color: #b9b3c2;
    font-size: 13px;
  }

  strong {
    color: #fff;
    font-size: 18px;
  }

  @media (max-width: 920px) {
    margin-left: 0;
    flex: 1;
    min-width: 220px;
  }
`;

export const AvatarFallback = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 144, 0, 0.32), rgba(255, 144, 0, 0.12));
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.08em;
  border: 1px solid rgba(255, 144, 0, 0.2);
`;

export const PowerButton = styled.button`
  width: 54px;
  height: 54px;
  border-radius: 18px;
  border: 0;
  background: rgba(255, 255, 255, 0.04);
  color: #b9b3c2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s, transform 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(255, 144, 0, 0.14);
    color: #ff9000;
    transform: translateY(-1px);
  }
`;

export const Content = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 32px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 360px;
  gap: 28px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 24px 16px 40px;
  }
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Hero = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 32px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(255, 144, 0, 0.2), transparent 28%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);

  > div:first-child {
    max-width: 620px;
  }

  span {
    color: #ff9000;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin-top: 16px;
    font-size: 40px;
    line-height: 1.08;
    color: #fff;
  }

  p {
    margin-top: 14px;
    color: #b9b3c2;
    font-size: 16px;
    line-height: 1.7;
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }

  @media (max-width: 768px) {
    padding: 24px;

    h1 {
      font-size: 32px;
    }
  }
`;

export const DatePill = styled.div`
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(18, 16, 22, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.08);

  svg {
    color: #ff9000;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  strong {
    color: #fff;
    font-size: 18px;
  }

  span {
    color: #c8c2d3;
    font-size: 14px;
    letter-spacing: 0;
    text-transform: none;
  }
`;

export const Overview = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: rgba(18, 16, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.2);

  span {
    display: block;
    color: #b9b3c2;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    display: block;
    margin-top: 12px;
    color: #fff;
    font-size: 40px;
    line-height: 1;
  }

  p {
    margin-top: 10px;
    color: #c8c2d3;
    line-height: 1.5;
  }
`;

export const Schedule = styled.section`
  padding: 28px;
  border-radius: 28px;
  background: rgba(18, 16, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 26px 56px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 22px;
  }
`;

export const ScheduleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  span {
    color: #ff9000;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  h2 {
    margin-top: 14px;
    color: #fff;
    font-size: 30px;
    line-height: 1.15;
  }

  p {
    margin-top: 10px;
    color: #b9b3c2;
    line-height: 1.6;
  }
`;

export const NextAppointment = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(255, 144, 0, 0.14), rgba(255, 144, 0, 0.05));
  border: 1px solid rgba(255, 144, 0, 0.18);

  > small {
    display: block;
    color: #ffd39c;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  > div {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  img,
  ${AvatarFallback} {
    width: 64px;
    height: 64px;
  }

  > div > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  strong {
    color: #fff;
    font-size: 22px;
  }

  span {
    color: #f0d7b0;
    line-height: 1.5;
  }

  p {
    margin-left: auto;
    min-width: 110px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 16px;
    background: rgba(18, 16, 22, 0.5);
    color: #fff;
    font-weight: 600;

    svg {
      color: #ff9000;
    }
  }

  @media (max-width: 768px) {
    > div {
      flex-wrap: wrap;
    }

    p {
      margin-left: 0;
    }
  }
`;

export const Section = styled.section`
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > div {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  svg {
    color: #ff9000;
  }

  strong {
    color: #fff;
    font-size: 20px;
  }

  span {
    color: #b9b3c2;
    font-size: 14px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(18, 16, 22, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.06);

  > span {
    min-width: 108px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 14px;
    background: rgba(255, 144, 0, 0.12);
    color: #fff;
    font-weight: 600;

    svg {
      color: #ff9000;
    }
  }

  > div {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  img,
  ${AvatarFallback} {
    width: 52px;
    height: 52px;
  }

  strong {
    color: #fff;
    font-size: 17px;
  }

  small {
    display: block;
    font-size: 12px;
    margin-top: 4px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;

    > span {
      min-width: 0;
      justify-content: flex-start;
    }
  }
`;

export const EmptyState = styled.div<{ $compact?: boolean }>`
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  text-align: center;

  strong {
    color: #fff;
    font-size: 18px;
  }

  p {
    margin-top: 8px;
    color: #b9b3c2;
    line-height: 1.6;
  }

  ${(props) => props.$compact && css`
    padding: 18px;

    strong {
      font-size: 16px;
      color: #c8c2d3;
    }
  `}
`;

export const Agenda = styled.aside`
  position: sticky;
  top: 24px;
  align-self: start;
  padding: 24px;
  border-radius: 28px;
  background: rgba(18, 16, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 26px 56px rgba(0, 0, 0, 0.22);
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1100px) {
    position: static;
  }

  @media (max-width: 768px) {
    padding: 22px;
  }
`;

export const AgendaHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  span {
    color: #ff9000;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  strong {
    color: #fff;
    font-size: 24px;
    line-height: 1.2;
  }

  > div:last-child {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const AgendaNavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 0;
  background: rgba(255, 255, 255, 0.05);
  color: #f4ede8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 144, 0, 0.16);
    transform: translateY(-1px);
  }
`;

export const AgendaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const WeekDayButton = styled.button<{ $active: boolean; $hasAppointments: boolean }>`
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  text-align: left;
  transition: transform 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;

  small {
    display: block;
    color: #b9b3c2;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #fff;
    font-size: 28px;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #ffca83;
    font-size: 13px;
    font-weight: 600;
  }

  em {
    display: block;
    margin-top: 14px;
    color: #fff;
    font-style: normal;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    margin-top: 6px;
    color: #b9b3c2;
    line-height: 1.5;
    font-size: 13px;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 144, 0, 0.24);
  }

  ${(props) => props.$hasAppointments && css`
    background: rgba(255, 144, 0, 0.08);
    border-color: rgba(255, 144, 0, 0.16);
    box-shadow: 0 16px 32px rgba(255, 144, 0, 0.08);
  `}

  ${(props) => props.$active && css`
    background: linear-gradient(135deg, rgba(255, 144, 0, 0.2), rgba(255, 144, 0, 0.08));
    border-color: rgba(255, 144, 0, 0.32);
    box-shadow: 0 20px 40px rgba(255, 144, 0, 0.12);
  `}
`;

export const AgendaFooter = styled.div`
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  div {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #f4ede8;
    font-weight: 600;
  }

  svg {
    color: #ff9000;
  }

  strong {
    display: block;
    margin-top: 10px;
    color: #b9b3c2;
    line-height: 1.6;
  }
`;
