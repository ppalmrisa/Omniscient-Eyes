'use client';

import { Button, Checkbox, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

import classes from './styles.module.css';

const CAPSTONE_SESSION_TOKEN = process.env.CAPSTONE_SESSION_TOKEN || 'capstone-session-token';

interface ILoginForm {
  email: string;
  password: string;
}

export function LoginFeature() {
  const router = useRouter();
  const [, setCookie] = useCookies([CAPSTONE_SESSION_TOKEN]);
  const form = useForm<ILoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 6 ? 'Password should include at least 6 characters' : null,
    },
  });

  const handleLogin = (values: ILoginForm) => {
    setCookie(CAPSTONE_SESSION_TOKEN, `${values.email}&${values.password}`, { path: '/' });
    router.push('/home');
  };

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit(handleLogin)}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            Welcome back to Capstone!
          </Title>
          <TextInput
            id="email"
            label="Email"
            placeholder="hello@gmail.com"
            size="md"
            {...form.getInputProps('email')}
          />
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps('password')}
          />
          <Checkbox id="remember" label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md" type="submit">
            Login
          </Button>
        </Paper>
      </form>
    </div>
  );
}
