import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, loading = false, disabled, ...rest }) => (
  <Container type="button" disabled={disabled || loading} {...rest}>
    {loading ? 'Carregando...' : children}
