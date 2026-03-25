import React, { useCallback, useRef, FormEvent } from 'react';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/Auth';
import { useToast } from '../../hooks/Toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { Background, Container, Content, AnimationContainer } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

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

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const data = { email, password };

    setErrors({});

    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('E-mail obrigatório'),
        password: Yup.string().required('Senha obrigatória'),
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
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
      });
    }
  }, [signIn, addToast, history]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <form onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input
              ref={emailRef}
              name="email"
              icon={FiMail}
              placeholder="E-mail"
              error={errors.email}
              disabled={loading}
            />
            <Input
              ref={passwordRef}
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              error={errors.password}
              disabled={loading}
            />

            <Button type="submit" loading={loading}>
              Entrar
            </Button>

            <a href="/forgot-password">Esqueci minha senha</a>
          </form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
