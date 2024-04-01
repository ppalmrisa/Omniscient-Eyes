'use client';

import { NumberFormatter, Progress, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { apiGetJobProgress } from '@/api/home';
import { ProgressJob } from '@/assets';

import classes from './styles.module.css';

export function ProgressBanner() {
  const { id } = useParams();
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tenSec, setTenSec] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      if (seconds % 10 === 0) {
        onGetJobProgress(id as string);
      }
      if (seconds >= 309) {
        // 5 minutes
        clearInterval(interval);
        router.push('/home');
      }
      if (progress === 100) {
        // if job done in 5 minutes
        if (tenSec && seconds >= tenSec - 1) {
          clearInterval(interval);
          router.push(`/detail/${id}`);
        }
        if (!tenSec) {
          setTenSec(seconds + 10);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    onGetJobProgress(id as string);
  }, []);

  const onGetJobProgress = async (jobId: string) => {
    try {
      const res = await apiGetJobProgress(jobId);
      setProgress(res.data.progress * 100);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      notifications.show({
        title: error?.message,
        message: `${error?.code} : ${message}`,
        color: 'red',
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>Wait a moment...</Title>
        <Text fw={500} fz="lg" mb={5}>
          {progress === 100 ? 'Your job result was  successful' : 'We are working on your job...'}
        </Text>
        <Text fz="sm" c="dimmed">
          If the job finishes within 5 minutes, you will be directed to the result page; otherwise,
          if the waiting time exceeds 5 minutes, we will redirect you to the main page
        </Text>
        <Progress.Root size="xl" mt="md" radius="xl">
          <Progress.Section
            color={progress === 100 ? 'teal' : 'blue'}
            value={progress > 10 ? progress : 10}
            animated={progress !== 100}
          >
            <Progress.Label>
              <NumberFormatter value={progress} decimalScale={2} />%
            </Progress.Label>
          </Progress.Section>
        </Progress.Root>
        {seconds >= 300 && (
          <Text fw={500} fz="md" mt="lg">
            After 5 minutes have elapsed, we will direct you to the main page in: {310 - seconds} s
          </Text>
        )}
        {tenSec && (
          <Text fw={500} fz="md" mt="lg">
            We got it!, we will direct you to the detail page in: {tenSec - seconds} s
          </Text>
        )}
      </div>
      <ProgressJob className={classes.image} />
    </div>
  );
}
