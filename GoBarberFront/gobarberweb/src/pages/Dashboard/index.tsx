import React, { useCallback, useEffect, useState } from 'react';
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMoon,
  FiPower,
  FiSun,
  FiSunset,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import logoImg from '../../assets/logo-bonzonis.png';

import {
  Agenda,
  AgendaFooter,
  AgendaGrid,
  AgendaHeader,
  AgendaNavButton,
  Appointment,
  AvatarFallback,
  Brand,
  Container,
  Content,
  DatePill,
  EmptyState,
  Header,
  HeaderContent,
  Hero,
  Main,
  NextAppointment,
  Overview,
  PowerButton,
  Profile,
  Schedule,
  ScheduleHeader,
  Section,
  SectionHeader,
  StatCard,
  WeekDayButton,
} from './styles';

interface AppointmentResponse {
  id: string;
  date: string;
  status: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface AppointmentData extends AppointmentResponse {
  hourFormatted: string;
}

interface AgendaDay {
  date: Date;
  appointments: AppointmentData[];
}

const normalizeDate = (date: Date): Date => new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
);

const addDays = (date: Date, amount: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return normalizeDate(nextDate);
};

const getWeekStart = (date: Date): Date => {
  const normalized = normalizeDate(date);
  const weekDay = normalized.getDay();
  const difference = weekDay === 0 ? -6 : 1 - weekDay;

  return addDays(normalized, difference);
};

const isSameDay = (firstDate: Date, secondDate: Date): boolean => (
  firstDate.getDate() === secondDate.getDate()
  && firstDate.getMonth() === secondDate.getMonth()
  && firstDate.getFullYear() === secondDate.getFullYear()
);

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const formatTime = (value: string): string => new Date(value).toLocaleTimeString('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
});

const formatWeekdayShort = (date: Date): string => capitalize(
  date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
);

const formatWeekdayLong = (date: Date): string => capitalize(
  date.toLocaleDateString('pt-BR', { weekday: 'long' }),
);

const formatMonthShort = (date: Date): string => capitalize(
  date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
);

const formatFullDate = (date: Date): string => capitalize(
  date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }),
);

const formatAppointmentsCount = (count: number): string => (
  count === 1 ? '1 atendimento' : `${count} atendimentos`
);

const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = addDays(weekStart, 6);

  return `${weekStart.getDate().toString().padStart(2, '0')} ${formatMonthShort(weekStart)} - ${weekEnd
    .getDate()
    .toString()
    .padStart(2, '0')} ${formatMonthShort(weekEnd)}`;
};

const getInitials = (name: string): string => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((namePart) => namePart.charAt(0))
  .join('')
  .toUpperCase();

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { addToast } = useToast();
  const today = normalizeDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(getWeekStart(today));
  const [weekAgenda, setWeekAgenda] = useState<AgendaDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadWeekAgenda = async () => {
      try {
        setLoading(true);

        const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
        const responses = await Promise.all(
          days.map((day) => api.get<AppointmentResponse[]>('/appointments/me', {
            params: {
              year: day.getFullYear(),
              month: day.getMonth() + 1,
              day: day.getDate(),
            },
          })),
        );

        if (!isMounted) {
          return;
        }

        const nextWeekAgenda = days.map((day, index) => {
          const appointments = responses[index].data
            .slice()
            .sort((firstAppointment, secondAppointment) => (
              new Date(firstAppointment.date).getTime() - new Date(secondAppointment.date).getTime()
            ))
            .map((appointment) => ({
              ...appointment,
              hourFormatted: formatTime(appointment.date),
            }));

          return {
            date: day,
            appointments,
          };
        });

        setWeekAgenda(nextWeekAgenda);
      } catch (error) {
        console.error('Failed to load weekly agenda:', error);
        addToast({
          type: 'error',
          title: 'Erro ao carregar a agenda',
          description: 'Nao foi possivel carregar os horarios da semana.',
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWeekAgenda();

    return () => {
      isMounted = false;
    };
  }, [weekStart, addToast]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handlePreviousWeek = useCallback(() => {
    const nextWeekStart = addDays(weekStart, -7);
    setWeekStart(nextWeekStart);
    setSelectedDate(nextWeekStart);
  }, [weekStart]);

  const handleNextWeek = useCallback(() => {
    const nextWeekStart = addDays(weekStart, 7);
    setWeekStart(nextWeekStart);
    setSelectedDate(nextWeekStart);
  }, [weekStart]);

  const selectedAgendaDay = weekAgenda.find((agendaDay) => isSameDay(agendaDay.date, selectedDate));
  const appointments = selectedAgendaDay?.appointments || [];
  const nextAppointment = appointments[0] || null;
  const morningAppointments = appointments.filter((appointment) => new Date(appointment.date).getHours() < 12);
  const afternoonAppointments = appointments.filter((appointment) => {
    const hour = new Date(appointment.date).getHours();
    return hour >= 12 && hour < 18;
  });
  const eveningAppointments = appointments.filter((appointment) => new Date(appointment.date).getHours() >= 18);
  const scheduledDays = weekAgenda.filter((agendaDay) => agendaDay.appointments.length > 0);
  const appointmentsInWeek = weekAgenda.reduce(
    (total, agendaDay) => total + agendaDay.appointments.length,
    0,
  );
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { color: '#28a745', text: 'Confirmado' };
      case 'pending':
        return { color: '#ffc107', text: 'Pendente' };
      case 'expired':
        return { color: '#dc3545', text: 'Expirado' };
      default:
        return { color: '#b9b3c2', text: 'Cancelado' };
    }
  };

  const userInitials = user?.name ? getInitials(user.name) : 'GB';

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Brand>
            <img src={logoImg} alt="Logo Bonzoni's" />
            <div>
              <span>Painel operacional</span>
              <strong>Agenda inteligente</strong>
            </div>
          </Brand>

          <Profile>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user?.name} />
            ) : (
              <AvatarFallback>{userInitials}</AvatarFallback>
            )}
            <div>
              <span>Bem-vindo de volta</span>
              <strong>{user?.name}</strong>
            </div>
          </Profile>

          <PowerButton type="button" onClick={handleSignOut} title="Sair">
            <FiPower />
          </PowerButton>
        </HeaderContent>
      </Header>

      <Content>
        <Main>
          <Hero>
            <div>
              <span>Dashboard</span>
              <h1>Seus horarios com contexto e foco no proximo atendimento</h1>
              <p>
                Visualize os dias com agenda, acompanhe o ritmo da semana e entre
                em cada turno com mais clareza.
              </p>
            </div>

            <DatePill>
              <FiCalendar size={18} />
              <div>
                <strong>{isSameDay(selectedDate, today) ? 'Hoje' : formatWeekdayLong(selectedDate)}</strong>
                <span>{formatFullDate(selectedDate)}</span>
              </div>
            </DatePill>
          </Hero>

          <Overview>
            <StatCard>
              <span>Agenda do dia</span>
              <strong>{appointments.length}</strong>
              <p>{appointments.length > 0 ? formatAppointmentsCount(appointments.length) : 'Dia livre por enquanto'}</p>
            </StatCard>

            <StatCard>
              <span>Dias com agenda</span>
              <strong>{scheduledDays.length}</strong>
              <p>dias ocupados na semana atual</p>
            </StatCard>

            <StatCard>
              <span>Volume da semana</span>
              <strong>{appointmentsInWeek}</strong>
              <p>{appointmentsInWeek > 0 ? formatAppointmentsCount(appointmentsInWeek) : 'Nenhum atendimento carregado'}</p>
            </StatCard>
          </Overview>

          <Schedule>
            <ScheduleHeader>
              <div>
                <span>Dia selecionado</span>
                <h2>{formatFullDate(selectedDate)}</h2>
                <p>
                  {appointments.length > 0
                    ? `${formatAppointmentsCount(appointments.length)} organizados para este dia`
                    : 'Sem atendimentos neste dia por enquanto'}
                </p>
              </div>
            </ScheduleHeader>

            {loading ? (
              <EmptyState>
                <strong>Carregando agenda da semana</strong>
                <p>Buscando os horarios para atualizar o painel.</p>
              </EmptyState>
            ) : (
              <>
                {nextAppointment && (
                  <NextAppointment>
                    <small>Proximo atendimento</small>
                    <div>
                      {nextAppointment.user.avatar_url ? (
                        <img
                          src={nextAppointment.user.avatar_url}
                          alt={nextAppointment.user.name}
                        />
                      ) : (
                        <AvatarFallback>{getInitials(nextAppointment.user.name)}</AvatarFallback>
                      )}

                      <div>
                        <strong>{nextAppointment.user.name}</strong>
                        <span>Cliente agendado para o primeiro horario disponivel do dia</span>
                      </div>

                      <p>
                        <FiClock />
                        {nextAppointment.hourFormatted}
                      </p>
                    </div>
                  </NextAppointment>
                )}

                {appointments.length === 0 ? (
                  <EmptyState>
                    <strong>Nenhum horario neste dia</strong>
                    <p>Selecione outro dia na agenda lateral para navegar pela semana.</p>
                  </EmptyState>
                ) : (
                  <>
                    <Section>
                      <SectionHeader>
                        <div>
                          <FiSun size={18} />
                          <strong>Manha</strong>
                        </div>
                        <span>{formatAppointmentsCount(morningAppointments.length)}</span>
                      </SectionHeader>

                      {morningAppointments.length > 0 ? morningAppointments.map((appointment) => (
                        <Appointment key={appointment.id}>
                          <span>
                            <FiClock />
                            {appointment.hourFormatted}
                          </span>

                          <div>
                            {appointment.user.avatar_url ? (
                              <img
                                src={appointment.user.avatar_url}
                                alt={appointment.user.name}
                              />
                            ) : (
                              <AvatarFallback>{getInitials(appointment.user.name)}</AvatarFallback>
                            )}

                            <div>
                              <strong>{appointment.user.name}</strong>
                              <small style={{
                                color: getStatusInfo(appointment.status).color,
                                fontWeight: 'bold'
                              }}>
                                {getStatusInfo(appointment.status).text}
                              </small>
                            </div>
                          </div>
                        </Appointment>
                      )) : (
                        <EmptyState $compact>
                          <strong>Sem horarios na manha</strong>
                        </EmptyState>
                      )}
                    </Section>

                    <Section>
                      <SectionHeader>
                        <div>
                          <FiSunset size={18} />
                          <strong>Tarde</strong>
                        </div>
                        <span>{formatAppointmentsCount(afternoonAppointments.length)}</span>
                      </SectionHeader>

                      {afternoonAppointments.length > 0 ? afternoonAppointments.map((appointment) => (
                        <Appointment key={appointment.id}>
                          <span>
                            <FiClock />
                            {appointment.hourFormatted}
                          </span>

                          <div>
                            {appointment.user.avatar_url ? (
                              <img
                                src={appointment.user.avatar_url}
                                alt={appointment.user.name}
                              />
                            ) : (
                              <AvatarFallback>{getInitials(appointment.user.name)}</AvatarFallback>
                            )}

                            <div>
                              <strong>{appointment.user.name}</strong>
                              <small style={{
                                color: getStatusInfo(appointment.status).color,
                                fontWeight: 'bold'
                              }}>
                                {getStatusInfo(appointment.status).text}
                              </small>
                            </div>
                          </div>
                        </Appointment>
                      )) : (
                        <EmptyState $compact>
                          <strong>Sem horarios na tarde</strong>
                        </EmptyState>
                      )}
                    </Section>

                    <Section>
                      <SectionHeader>
                        <div>
                          <FiMoon size={18} />
                          <strong>Noite</strong>
                        </div>
                        <span>{formatAppointmentsCount(eveningAppointments.length)}</span>
                      </SectionHeader>

                      {eveningAppointments.length > 0 ? eveningAppointments.map((appointment) => (
                        <Appointment key={appointment.id}>
                          <span>
                            <FiClock />
                            {appointment.hourFormatted}
                          </span>

                          <div>
                            {appointment.user.avatar_url ? (
                              <img
                                src={appointment.user.avatar_url}
                                alt={appointment.user.name}
                              />
                            ) : (
                              <AvatarFallback>{getInitials(appointment.user.name)}</AvatarFallback>
                            )}

                            <div>
                              <strong>{appointment.user.name}</strong>
                              <small style={{
                                color: getStatusInfo(appointment.status).color,
                                fontWeight: 'bold'
                              }}>
                                {getStatusInfo(appointment.status).text}
                              </small>
                            </div>
                          </div>
                        </Appointment>
                      )) : (
                        <EmptyState $compact>
                          <strong>Sem horarios na noite</strong>
                        </EmptyState>
                      )}
                    </Section>
                  </>
                )}
              </>
            )}
          </Schedule>
        </Main>

        <Agenda>
          <AgendaHeader>
            <div>
              <span>Agenda da semana</span>
              <strong>{formatWeekRange(weekStart)}</strong>
            </div>

            <div>
              <AgendaNavButton type="button" onClick={handlePreviousWeek} aria-label="Semana anterior">
                <FiChevronLeft />
              </AgendaNavButton>
              <AgendaNavButton type="button" onClick={handleNextWeek} aria-label="Proxima semana">
                <FiChevronRight />
              </AgendaNavButton>
            </div>
          </AgendaHeader>

          <AgendaGrid>
            {weekAgenda.map((agendaDay) => (
              <WeekDayButton
                key={agendaDay.date.toISOString()}
                type="button"
                onClick={() => handleSelectDate(agendaDay.date)}
                $active={isSameDay(agendaDay.date, selectedDate)}
                $hasAppointments={agendaDay.appointments.length > 0}
              >
                <small>{formatWeekdayShort(agendaDay.date)}</small>
                <strong>{agendaDay.date.getDate().toString().padStart(2, '0')}</strong>
                <span>{formatMonthShort(agendaDay.date)}</span>
                <em>
                  {agendaDay.appointments.length > 0
                    ? formatAppointmentsCount(agendaDay.appointments.length)
                    : 'Livre'}
                </em>
                <p>
                  {agendaDay.appointments[0]
                    ? `Primeiro as ${agendaDay.appointments[0].hourFormatted}`
                    : 'Sem horarios'}
                </p>
              </WeekDayButton>
            ))}
          </AgendaGrid>

          <AgendaFooter>
            <div>
              <FiUsers />
              <span>{`${scheduledDays.length} dias com agenda nesta semana`}</span>
            </div>
            <strong>
              {appointmentsInWeek > 0
                ? `${appointmentsInWeek} horarios confirmados no total`
                : 'Semana sem horarios confirmados'}
            </strong>
          </AgendaFooter>
        </Agenda>
      </Content>
    </Container>
  );
};

export default Dashboard;
