import { Button } from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import { Group, Modal, Stack, Text } from '@mantine/core';
import { useState } from 'react';

interface ResetButtonProps {
  onClick: () => void;
}

const ResetButton = (props: ResetButtonProps) => {
  const { onClick } = props;

  const [opened, setOpened] = useState(false);

  return (
    <>
      <Button
        className='wheel-controls-button'
        onClick={() => setOpened(true)}
        variant='contained'
        color='primary'
        endIcon={<IconRefresh size={18} style={{ marginBottom: 2 }} />}
      >
        Обнулить
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Сбросить колесо?"
        centered
        size='sm'
      >
        <Stack gap='xs'>
          <Text>Это действие вернет всех участников обратно в колесо.</Text>
          <Group justify='flex-end'>
            <Button onClick={() => setOpened(false)}>Отменить</Button>
            <Button onClick={onClick} variant='contained' color='primary'>
              Обнулить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ResetButton;
