import React, {
  InputHTMLAttributes, useState, useCallback, forwardRef,
} from 'react';
import type { IconBaseProps } from 'react-icons/lib';
import { FiAlertCircle } from 'react-icons/fi';
import { Container, Error } from './style';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, icon: Icon, error, ...rest }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsFilled(!!e.target.value);
    }, []);

    return (
      <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
        {Icon && <Icon size={20} />}
        <input
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          ref={ref}
          {...rest}
        />
        {error && (
          <Error title={error}>
            <FiAlertCircle color="#C53030" size={20} />
          </Error>
        )}
      </Container>
    );
  }
);

Input.displayName = 'Input';

export default Input;
