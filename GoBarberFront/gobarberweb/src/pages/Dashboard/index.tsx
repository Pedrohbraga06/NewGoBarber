import React, { useCallback, useEffect, useState } from 'react';
import {
  FiClock,
  FiPower,
  FiCalendar,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
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
  const { addToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get<AppointmentData[]>('/appointments/me', {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        });

        const appointmentsFormatted = response.data.map(appointment => ({
          ...appointment,
          hourFormatted: new Date(appointment.date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setAppointments(appointmentsFormatted);
      } catch (error) {
        console.error('Failed to load appointments:', error);
        addToast({
          type: 'error',
          title: 'Erro ao carregar agendamentos',
          description: 'Não foi possível carregar seus agendamentos.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [selectedDate, addToast]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const nextAppointment = appointments.length > 0 ? appointments[0] : null;
  const morningAppointments = appointments.filter(appointment => {
    const hour = new Date(appointment.date).getHours();
    return hour < 12;
  });
  const afternoonAppointments = appointments.filter(appointment => {
    const hour = new Date(appointment.date).getHours();
    return hour >= 12;
  });

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user?.avatar_url} alt={user?.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user?.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={handleSignOut} title="Sair">
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>{selectedDate.toLocaleDateString('pt-BR')}</span>
            <span>Hoje</span>
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Carregando...</p>
          ) : (
            <>
              {nextAppointment && (
                <NextAppointment>
                  <strong>Próximo atendimento</strong>
                  <div>
                    <img
                      src={nextAppointment.user.avatar_url}
                      alt={nextAppointment.user.name}
                    />
                    <strong>{nextAppointment.user.name}</strong>
                    <span>
                      <FiClock />
                      {nextAppointment.hourFormatted}
                    </span>
                  </div>
                </NextAppointment>
              )}

              {morningAppointments.length > 0 && (
                <Section>
                  <strong>Manhã</strong>
                  {morningAppointments.map(appointment => (
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
              )}

              {afternoonAppointments.length > 0 && (
                <Section>
                  <strong>Tarde</strong>
                  {afternoonAppointments.map(appointment => (
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
              )}

              {appointments.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  Nenhum agendamento para hoje
                </p>
              )}
            </>
          )}
