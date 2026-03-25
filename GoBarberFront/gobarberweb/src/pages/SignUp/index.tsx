import React, { useCallback, useRef, FormEvent } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/Toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { Background, Container, AnimationContainer, Content } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

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

      const name = nameRef.current?.value || '';
      const email = emailRef.current?.value || '';
      const password = passwordRef.current?.value || '';
      const data = { name, email, password };

      setErrors({});
      setLoading(true);

      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon no GoBarber!',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          setErrors(validationErrors);
          return;
        }

        if (err instanceof Error && 'response' in err) {
          const response = (err as any).response;
          if (response?.status === 409) {
            addToast({
              type: 'error',
              title: 'E-mail já cadastrado',
              description: 'Este e-mail já possui uma conta.',
            });
            return;
          }
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <form onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>

            <Input
              ref={nameRef}
              name="name"
              icon={FiUser}
              placeholder="Nome"
              error={errors.name}
              disabled={loading}
            />
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
              Cadastrar
            </Button>
          </form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
