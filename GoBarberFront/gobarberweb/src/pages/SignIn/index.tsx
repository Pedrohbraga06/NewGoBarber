import React, { useCallback, useRef, FormEvent } from 'react';
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiLock,
  FiMail,
  FiShield,
} from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  AnimationContainer,
  Background,
  BackgroundContent,
  Container,
  Content,
  FormFooter,
  FormHeader,
  FormMeta,
  HighlightList,
  StatCard,
  SupportButton,
} from './styles';

interface FormErrors {
  [key: string]: string;
}

const SignIn: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { signIn, loading } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const [errors, setErrors] = React.useState<FormErrors>({});

  const handlePasswordAssistance = useCallback(() => {
    history.push('/forgot-password');
  }, [history]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const data = { email, password };

    setErrors({});

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Digite um e-mail valido')
          .required('E-mail obrigatorio'),
        password: Yup.string().required('Senha obrigatoria'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = getValidationErrors(err);
        setErrors(validationErrors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticacao',
        description: err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao fazer login. Confira suas credenciais e tente novamente.',
      });
    }
  }, [signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <FormHeader>
            <span>Agenda clara para dias corridos</span>
            <h1>Entre e acompanhe sua rotina sem perder tempo</h1>
            <p>
              Centralize horarios, clientes e proximos atendimentos em um painel
              mais fluido e facil de consultar.
            </p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <Input
              ref={emailRef}
              name="email"
              icon={FiMail}
              type="email"
              placeholder="E-mail"
              error={errors.email}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
            <Input
              ref={passwordRef}
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              error={errors.password}
              disabled={loading}
              autoComplete="current-password"
            />

            <Button type="submit" loading={loading}>
              Entrar no painel
            </Button>

            <FormMeta>
              <span>Use o e-mail da sua conta para liberar o painel rapidamente.</span>
              <SupportButton type="button" onClick={handlePasswordAssistance}>
                Preciso recuperar a senha
              </SupportButton>
            </FormMeta>
          </form>

          <FormFooter>
            <span>Ainda nao tem acesso?</span>
            <Link to="/signup">
              Criar conta
              <FiArrowRight />
            </Link>
          </FormFooter>
        </AnimationContainer>
      </Content>

      <Background>
        <BackgroundContent>
          <span>GoBarber Studio</span>
          <h2>Organize a agenda do dia antes mesmo do primeiro cliente chegar.</h2>

          <HighlightList>
            <li>
              <FiClock size={20} />
              <div>
                <strong>Proximos horarios em foco</strong>
                <p>Veja o que vem a seguir no turno sem procurar em varias telas.</p>
              </div>
            </li>
            <li>
              <FiCalendar size={20} />
              <div>
                <strong>Rotina mais previsivel</strong>
                <p>Encontre clientes, horarios e contexto no mesmo fluxo.</p>
              </div>
            </li>
            <li>
              <FiShield size={20} />
              <div>
                <strong>Acesso simples e seguro</strong>
                <p>Entre rapido e siga para o dashboard com menos atrito.</p>
              </div>
            </li>
          </HighlightList>

          <StatCard>
            <strong>+120</strong>
            <span>agendamentos acompanhados com mais contexto por semana</span>
          </StatCard>
        </BackgroundContent>
      </Background>
    </Container>
  );
};

export default SignIn;
