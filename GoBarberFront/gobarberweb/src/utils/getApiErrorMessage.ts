import axios from 'axios';

interface ApiErrorOptions {
  fallbackMessage?: string;
  networkMessage?: string;
  statusMessages?: Record<number, string>;
}

export default function getApiErrorMessage(
  error: unknown,
  options: ApiErrorOptions = {},
): string {
  const {
    fallbackMessage = 'Ocorreu um erro ao processar sua solicitacao.',
    networkMessage = 'Nao foi possivel conectar ao backend. Verifique se a API esta rodando em http://localhost:3333.',
    statusMessages = {},
  } = options;

  if (axios.isAxiosError(error)) {
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
      return networkMessage;
    }

    const statusMessage = statusMessages[error.response.status];

    if (statusMessage) {
      return statusMessage;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}
