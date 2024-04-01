'use client';

import {
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  ScrollArea,
  Table,
  Text,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconDotsVertical, IconEdit, IconFileSearch, IconTrash } from '@tabler/icons-react';
import cx from 'clsx';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { apiDeleteJob } from '@/api/home';
import { InputWithButton } from '@/components';
import { IGetJobList, IRequestList } from '@/types';
import { useQueryParams } from '@/utils';

import classes from './styles.module.css';

interface IHomeTable {
  data: IRequestList<IGetJobList>;
}

export default function HomeTable({ data }: IHomeTable) {
  const { data: jobs } = data;
  const { setQueryParams } = useQueryParams();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page'));
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [jobId, setJobId] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleClickDetail = (type: 'edit' | 'view', id: string) => {
    if (type === 'view') router.push(`/detail/${id}`);
    if (type === 'edit') router.push(`/edit/${id}`);
  };

  const onDeleteJob = async () => {
    try {
      await apiDeleteJob(jobId);
      setQueryParams({ deleteSuccessfully: true });
      setJobId('');
      close();
      notifications.show({
        title: 'delete Job successfully',
        message: 'Job deleted 🥳',
        color: 'green',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      notifications.show({
        title: error?.message,
        message: `${error?.code} : ${message}`,
        color: 'red',
      });
    }
  };

  const rows =
    jobs &&
    jobs.map((row, index) => {
      let statusColor = 'gray';
      switch (row.status) {
        case 'working':
          statusColor = 'blue';
          break;
        case 'failed':
          statusColor = 'red';
          break;
        case 'waiting':
          statusColor = 'yellow';
          break;
        case 'done':
          statusColor = 'green';
          break;
        default:
          break;
      }

      return (
        <Table.Tr key={row.id}>
          <Table.Td>{index + 1 + (page - 1) * 10}</Table.Td>
          <Table.Td>{row.jobName}</Table.Td>
          <Table.Td>
            <Badge variant="light" radius="md" color={statusColor} w={80}>
              {row.status}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Text w={130} size="sm">
              {dayjs(row.jobPeriodStart).format('D MMM YYYY HH:mm')}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text w={130} size="sm">
              {dayjs(row.jobPeriodEnd).format('D MMM YYYY HH:mm')}
            </Text>
          </Table.Td>
          <Table.Td>
            <Menu shadow="md" radius="md">
              <Menu.Target>
                <Button variant="transparent" radius="xl">
                  <IconDotsVertical />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconFileSearch style={{ width: rem(14), height: rem(14) }} color="blue" />
                  }
                  onClick={() => handleClickDetail('view', row.id)}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconEdit style={{ width: rem(14), height: rem(14) }} color="green" />
                  }
                  onClick={() => handleClickDetail('edit', row.id)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} color="red" />
                  }
                  onClick={() => {
                    open();
                    setJobId(row.id);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Table.Td>
        </Table.Tr>
      );
    });

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQueryParams({ jobName: searchValue });
        }}
      >
        <InputWithButton
          mb="md"
          onChange={(event) => {
            if (event.currentTarget.value === '') {
              setQueryParams({ jobName: '' });
            }
            setSearchValue(event.currentTarget.value);
          }}
        />
      </form>
      <ScrollArea
        h={data?.data && data.data.length >= 10 ? 620 : 'auto'}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
        type="always"
      >
        <Table verticalSpacing="xs" w={600}>
          <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
              <Table.Th>No.</Table.Th>
              <Table.Th>Job Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Start date</Table.Th>
              <Table.Th>End date</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          {jobs.length > 0 ? (
            <Table.Tbody>{rows}</Table.Tbody>
          ) : (
            <Table.Tbody>
              <Table.Tr>
                <Table.Td />
                <Table.Td />
                <Table.Td>
                  <Text size="sm">No Data</Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          )}
        </Table>
        <Modal opened={opened} onClose={close} title="Delete Job" centered radius="md">
          <Text>Are you sure you want to delete this job? </Text>
          <Group gap="sm" justify="flex-end" mt="lg">
            <Button w="120" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button bg="red" w="120" onClick={onDeleteJob}>
              Delete
            </Button>
          </Group>
        </Modal>
      </ScrollArea>
    </Box>
  );
}
