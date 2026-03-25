import React, { FormEvent, useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiMail, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
} from './ForgotPasswordStyles';

interface FormErrors {
  [key: string]: string;
}

const ForgotPasswordPage: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value?.trim() || '';
    const data = { email };

    setErrors({});

    try {
      setLoading(true);

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail obrigatorio')
          .email('Digite um e-mail valido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/forgot', data);

      setRequestSent(true);

      addToast({
        type: 'success',
        title: 'E-mail enviado',
        description: 'Se o e-mail estiver cadastrado, voce recebera as instrucoes para redefinir sua senha.',
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors(getValidationErrors(error));
        return;
      }

      const message = getApiErrorMessage(error, {
        fallbackMessage: 'Nao foi possivel solicitar a recuperacao de senha.',
      }).replace('User does not exists.', 'Nao encontramos uma conta com este e-mail.');

      addToast({
        type: 'error',
        title: 'Erro ao recuperar senha',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Logo Bonzoni's" />

          <FormHeader>
            <span>Recuperacao de acesso</span>
            <h1>Receba um link seguro para criar uma nova senha</h1>
            <p>
              Informe o e-mail da sua conta e nos cuidamos do resto para voce
              voltar ao painel com seguranca.
            </p>
          </FormHeader>

          {requestSent && (
            <HelperCard $success>
              <strong>Verifique sua caixa de entrada</strong>
              <p>
                O link de redefinicao foi solicitado. Procure tambem na pasta de
                spam caso o e-mail nao apareca em alguns minutos.
              </p>
            </HelperCard>
          )}

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

            <Button type="submit" loading={loading}>
              Enviar link de recuperacao
            </Button>

            <FormMeta>
              <span>Use o mesmo e-mail cadastrado para receber o link correto.</span>
            </FormMeta>
          </form>

          <FormFooter>
            <span>Lembrou a senha?</span>
            <Link to="/">
              <FiArrowLeft />
              Voltar para logon
            </Link>
          </FormFooter>
        </AnimationContainer>
      </Content>

      <Background>
        <BackgroundContent>
          <span>GoBarber Studio</span>
          <h2>Proteja o acesso da sua agenda sem complicar a experiencia.</h2>

          <HighlightList>
            <li>
              <FiShield size={20} />
              <div>
                <strong>Link unico e seguro</strong>
                <p>O backend ja envia um token exclusivo para redefinicao da senha.</p>
              </div>
            </li>
            <li>
              <FiCheckCircle size={20} />
              <div>
                <strong>Fluxo simples</strong>
                <p>Voce informa o e-mail, recebe o link e volta rapido para o painel.</p>
              </div>
            </li>
            <li>
              <FiMail size={20} />
              <div>
                <strong>Sem depender de suporte</strong>
                <p>Recupere o acesso sozinho em poucos passos sempre que precisar.</p>
              </div>
            </li>
          </HighlightList>

          <StatCard>
            <strong>1 passo</strong>
            <span>para solicitar a redefinicao e receber o link no e-mail cadastrado</span>
          </StatCard>
        </BackgroundContent>
      </Background>
    </Container>
  );
};

export default ForgotPasswordPage;
