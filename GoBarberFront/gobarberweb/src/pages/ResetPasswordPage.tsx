import React, { FormEvent, useCallback, useRef, useState } from 'react';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
  FiShield,
  FiZap,
} from 'react-icons/fi';
import { Link, useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import logoImg from '../assets/logo-bonzonis.png';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast } from '../hooks/Toast';
import api from '../services/api';
import getApiErrorMessage from '../utils/getApiErrorMessage';
import getValidationErrors from '../utils/getValidationErrors';
import {
  AnimationContainer,
  Background,
  BackgroundContent,
  Container,
  Content,
  FormFooter,
  FormHeader,
  FormMeta,
  HelperCard,
  HighlightList,
  StatCard,
} from './ResetPasswordStyles';

interface FormErrors {
  [key: string]: string;
}

const ResetPasswordPage: React.FC = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const location = useLocation();
  const { addToast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const token = new URLSearchParams(location.search).get('token') || '';

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const password = passwordRef.current?.value || '';
    const passwordConfirmation = passwordConfirmationRef.current?.value || '';
    const data = {
      token,
      password,
      password_confirmation: passwordConfirmation,
    };

    setErrors({});

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        password: Yup.string()
          .required('Senha obrigatoria')
          .min(6, 'No minimo 6 digitos'),
        password_confirmation: Yup.string()
          .required('Confirme a nova senha')
          .oneOf([Yup.ref('password')], 'As senhas precisam ser iguais'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (!token) {
        throw new Error('O link de redefinicao esta incompleto. Solicite um novo e-mail.');
      }

      await api.post('/password/reset', data);

      addToast({
        type: 'success',
        title: 'Senha atualizada',
        description: 'Sua nova senha foi salva. Agora voce ja pode entrar no GoBarber.',
      });

      history.push('/');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(error));
        return;
      }

      const message = getApiErrorMessage(error, {
        fallbackMessage: 'Nao foi possivel redefinir sua senha.',
        statusMessages: {
          400: 'O link de redefinicao e invalido ou expirou. Solicite um novo e-mail.',
        },
      });

      addToast({
        type: 'error',
        title: 'Erro ao redefinir senha',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [addToast, history, token]);

  return (
    <Container>
      <Background>
        <BackgroundContent>
          <span>Nova credencial</span>
          <h2>Finalize a redefinicao com uma senha forte e facil de lembrar.</h2>

          <HighlightList>
            <li>
              <FiShield size={20} />
              <div>
                <strong>Token validado pelo backend</strong>
                <p>O endpoint de reset confere o token antes de aplicar a nova senha.</p>
              </div>
            </li>
            <li>
              <FiZap size={20} />
              <div>
                <strong>Volta rapida para o painel</strong>
                <p>Assim que salvar a nova senha, o acesso fica pronto para o proximo login.</p>
              </div>
            </li>
            <li>
              <FiCheckCircle size={20} />
              <div>
                <strong>Confirmacao no proprio fluxo</strong>
                <p>Voce redefine, recebe feedback e retorna para o logon sem ruido.</p>
              </div>
            </li>
          </HighlightList>

          <StatCard>
            <strong>2 campos</strong>
            <span>para concluir a troca de senha quando o link de redefinicao estiver valido</span>
          </StatCard>
        </BackgroundContent>
      </Background>

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Logo Bonzoni's" />

          <FormHeader>
            <span>Redefinicao de senha</span>
            <h1>Crie uma nova senha para voltar ao GoBarber</h1>
            <p>
              Escolha uma senha segura e confirme abaixo para liberar o acesso
              da sua conta novamente.
            </p>
          </FormHeader>

          {!token && (
            <HelperCard>
              <strong>Link incompleto</strong>
              <p>
                O token de redefinicao nao foi encontrado nesta URL. Solicite um
                novo e-mail para continuar.
              </p>
            </HelperCard>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              ref={passwordRef}
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
              error={errors.password}
              disabled={loading || !token}
              autoComplete="new-password"
              autoFocus
            />
            <Input
              ref={passwordConfirmationRef}
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar nova senha"
              error={errors.password_confirmation}
              disabled={loading || !token}
              autoComplete="new-password"
            />

            <Button type="submit" loading={loading} disabled={!token}>
              Salvar nova senha
            </Button>

            <FormMeta>
              <span>Use pelo menos 6 digitos e repita a mesma senha no segundo campo.</span>
            </FormMeta>
          </form>

          <FormFooter>
            <span>Quer pedir outro link?</span>
            <Link to="/forgot-password">
              <FiArrowLeft />
              Voltar para recuperacao
            </Link>
          </FormFooter>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPasswordPage;
