import type { Meta, StoryObj } from '@storybook/react-webpack5';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Clique aqui',
  },
};

export const Loading: Story = {
  args: {
    children: 'Salvar',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Desabilitado',
    disabled: true,
  },
};
