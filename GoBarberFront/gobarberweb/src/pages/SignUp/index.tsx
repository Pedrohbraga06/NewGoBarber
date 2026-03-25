import React, { useCallback, useRef, FormEvent } from 'react';
import axios from 'axios';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import logoImg from '../../assets/logo-bonzonis.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import {
  AnimationContainer,
  Background,
  BackgroundContent,
  Container,
  Content,
  FormFooter,
  FormHeader,
  HighlightList,
  StatCard,
} from './styles';

interface FormErrors {
  [key: string]: string;
}

const getApiErrorMessage = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const responseData = error.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === 'object') {
    const message = 'message' in responseData ? responseData.message : null;
    const errorText = 'error' in responseData ? responseData.error : null;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (typeof errorText === 'string' && errorText.trim()) {
      return errorText;
    }
  }

  if (!error.response) {
    return 'Nao foi possivel conectar ao backend. Verifique se a API esta rodando em http://localhost:3333.';
  }

  return null;
};

const SignUp: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const name = nameRef.current?.value?.trim() || '';
      const email = emailRef.current?.value?.trim() || '';
      const password = passwordRef.current?.value || '';
      const data = { name, email, password };

      setErrors({});
      setLoading(true);

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatorio'),
          email: Yup.string()
            .required('E-mail obrigatorio')
            .email('Digite um e-mail valido'),
          password: Yup.string().min(6, 'No minimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Voce ja pode fazer seu logon no GoBarber.',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          setErrors(validationErrors);
          return;
        }

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const responseMessage = getApiErrorMessage(err);

          if (status === 400 || status === 409) {
            addToast({
              type: 'error',
              title: 'Nao foi possivel concluir o cadastro',
              description: responseMessage || 'Este e-mail ja possui uma conta ou os dados enviados sao invalidos.',
            });
            return;
          }

          if (responseMessage) {
            addToast({
              type: 'error',
              title: 'Erro no cadastro',
              description: responseMessage,
            });
            return;
          }
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro. Tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background>
        <BackgroundContent>
          <span>Configuracao guiada</span>
          <h2>Monte sua base com calma e comece a atender com mais seguranca.</h2>

          <HighlightList>
            <li>
              <FiCheckCircle size={20} />
              <div>
                <strong>Cadastro direto ao ponto</strong>
                <p>Entre no sistema em poucos passos e sem campos desnecessarios.</p>
              </div>
            </li>
            <li>
              <FiUsers size={20} />
              <div>
                <strong>Relacao com clientes mais clara</strong>
                <p>Comece a estruturar sua agenda com contexto desde o inicio.</p>
              </div>
            </li>
            <li>
              <FiCalendar size={20} />
              <div>
                <strong>Rotina pronta para escalar</strong>
                <p>Uma experiencia preparada para desktop, mobile e dias corridos.</p>
              </div>
            </li>
          </HighlightList>

          <StatCard>
            <strong>3 min</strong>
            <span>para sair do cadastro e chegar ao painel com tudo pronto para testar</span>
          </StatCard>
        </BackgroundContent>
      </Background>

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Logo Bonzoni's" />

          <FormHeader>
            <span>Comece com uma base bem montada</span>
            <h1>Crie sua conta e organize o atendimento desde o primeiro acesso</h1>
            <p>
              Cadastro rapido para entrar no painel com uma experiencia mais clara,
              segura e preparada para crescer junto com a sua rotina.
            </p>
          </FormHeader>

          <form onSubmit={handleSubmit}>
            <Input
              ref={nameRef}
              name="name"
              icon={FiUser}
              placeholder="Nome"
              error={errors.name}
              disabled={loading}
              autoComplete="name"
              autoFocus
            />
            <Input
              ref={emailRef}
              name="email"
              icon={FiMail}
              type="email"
              placeholder="E-mail"
              error={errors.email}
              disabled={loading}
              autoComplete="email"
            />
            <Input
              ref={passwordRef}
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              error={errors.password}
              disabled={loading}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading}>
              Criar minha conta
            </Button>
          </form>

          <FormFooter>
            <span>Ja tem conta?</span>
            <Link to="/">
              <FiArrowLeft />
              Voltar para logon
            </Link>
          </FormFooter>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
