import React, { useCallback, useEffect, useState } from 'react';
import {
  FiClock,
  FiPower,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
} from './styles';

interface AppointmentData {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  useEffect(() => {
    api.get<AppointmentData[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      },
    }).then(response => {
      const appointmentsFormatted = response.data.map(appointment => ({
        ...appointment,
        hourFormatted: new Date(appointment.date).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      setAppointments(appointmentsFormatted);
    });
  }, [selectedDate]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={handleSignOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>{selectedDate.toLocaleDateString()}</span>
            <span>Hoje</span>
          </p>

          <NextAppointment>
            <strong>Próximo atendimento</strong>
            {appointments.length > 0 && (
              <div>
                <img
                  src={appointments[0].user.avatar_url}
                  alt={appointments[0].user.name}
                />
                <strong>{appointments[0].user.name}</strong>
                <span>
                  <FiClock />
                  {appointments[0].hourFormatted}
                </span>
              </div>
            )}
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>
            {appointments
              .filter(appointment => {
                const hour = new Date(appointment.date).getHours();
                return hour < 12;
              })
              .map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
          </Section>

          <Section>
            <strong>Tarde</strong>
            {appointments
              .filter(appointment => {
                const hour = new Date(appointment.date).getHours();
                return hour >= 12;
              })
              .map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hourFormatted}
                  </span>
                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default Dashboard;
