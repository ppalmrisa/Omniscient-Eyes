import { ActionIcon, TextInput, TextInputProps, rem, useMantineTheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface IInputWithButton extends TextInputProps {
  onClickRightSection?: () => void;
}

export function InputWithButton(props: IInputWithButton) {
  const theme = useMantineTheme();

  return (
    <TextInput
      radius="xl"
      size="md"
      placeholder="Search Job"
      rightSectionWidth={42}
      leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={props.onClickRightSection}
          type="submit"
        >
          <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      }
      {...props}
    />
  );
}
