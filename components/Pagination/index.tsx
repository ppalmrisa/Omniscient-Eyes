import { ActionIcon, Flex, Select, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

import { useQueryParams } from '@/utils';

import classes from './styles.module.css';

interface IPagination {
  total: number;
}

export default function Pagination({ total }: IPagination) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page'));
  const pageSize = Number(searchParams.get('pageSize'));

  const { setQueryParams } = useQueryParams();
  const onClickChangePage = (type: 'prev' | 'next') => {
    switch (type) {
      case 'prev':
        setQueryParams({ page: page - 1 });
        break;
      case 'next':
        setQueryParams({ page: page + 1 });
        break;
      default:
        break;
    }
  };

  const disabledButton = (type: 'prev' | 'next') => {
    switch (type) {
      case 'prev':
        return page === 1;
      case 'next':
        return page * pageSize >= total;
    }
  };

  const onChangeLimit = (value: string | null) => setQueryParams({ pageSize: value });

  return (
    <Flex justify="end" c="gray-text" gap="md" align="center" mb="xl">
      <Select
        value={`${pageSize}`}
        size="xs"
        onChange={onChangeLimit}
        w="80px"
        data={['10', '20', '50', '100']}
      />
      <ActionIcon
        variant="outline"
        onClick={() => onClickChangePage('prev')}
        disabled={disabledButton('prev')}
        className={classes['action-icon-button']}
      >
        <IconChevronLeft style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
      <Text size="sm">{`Page : ${page}`}</Text>
      <ActionIcon
        variant="outline"
        onClick={() => onClickChangePage('next')}
        disabled={disabledButton('next')}
        className={classes['action-icon-button']}
      >
        <IconChevronRight style={{ width: '70%', height: '70%' }} />
      </ActionIcon>
    </Flex>
  );
}
