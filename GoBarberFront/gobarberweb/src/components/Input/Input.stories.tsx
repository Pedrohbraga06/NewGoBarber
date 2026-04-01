import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FiMail } from 'react-icons/fi';
import Input from './index';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    error: {
      control: 'text',
    },
    icon: {
      control: false, // Can't control icon easily, so disable
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'email',
    placeholder: 'Digite seu email',
  },
};

export const WithIcon: Story = {
  args: {
    name: 'email',
    placeholder: 'Digite seu email',
    icon: FiMail,
  },
};

export const WithError: Story = {
  args: {
    name: 'email',
    placeholder: 'Digite seu email',
    error: 'Email inválido',
  },
};

export const Filled: Story = {
  args: {
    name: 'email',
    placeholder: 'Digite seu email',
    defaultValue: 'usuario@example.com',
  },
};
