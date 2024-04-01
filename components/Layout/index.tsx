'use client';

import { Box, Center, Container } from '@mantine/core';
import { usePathname } from 'next/navigation';

import { HeaderMegaMenu } from '../Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProgressPage = pathname.includes('/progress');

  return (
    <Box>
      <HeaderMegaMenu />
      {isProgressPage ? (
        <Center py="xl" px="xl" w="calc(100vw - 32px)">
          {children}
        </Center>
      ) : (
        <Container size="responsive" h="calc(100vh - 60px)">
          <Center py="xl">{children}</Center>
        </Container>
      )}
    </Box>
  );
}
