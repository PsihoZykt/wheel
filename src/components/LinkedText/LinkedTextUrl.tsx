import React, { useState } from 'react';
import { ActionIcon, Anchor, Group, Modal, Text, Button, Stack, Tooltip } from '@mantine/core';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useDispatch } from 'react-redux';

import { addAlert } from '@reducers/notifications/notifications';
import { AlertTypeEnum } from '@models/alert.model.ts';
import { ALLOWED_SAFE_DOMAINS } from '@constants/common.constants.ts';

interface LinkedTextUrlProps {
  href: string;
  content: string;
  copyable?: boolean;
  linkProps?: Record<string, any>;
}

const LinkedTextUrl = ({ href, content, copyable = false, linkProps = {} }: LinkedTextUrlProps) => {
  const dispatch = useDispatch();
  const [showWarningModal, setShowWarningModal] = useState(false);

  const isUrlSafe = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return ALLOWED_SAFE_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    } catch {
      return false;
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(href)
      .then(() => {
        dispatch(
          addAlert({
            type: AlertTypeEnum.Info,
            message: 'Ссылка скопирована',
          }),
        );
      })
      .catch(() => {
        dispatch(
          addAlert({
            type: AlertTypeEnum.Error,
            message: 'Не удалось скопировать',
          }),
        );
      });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (!isUrlSafe(href)) {
      e.preventDefault();
      setShowWarningModal(true);
    }
  };

  const handleConfirmNavigation = () => {
    setShowWarningModal(false);
    window.open(href, '_blank');
  };

  return (
    <>
      <Group gap='xs' wrap='nowrap' component='span'>
        {copyable && (
          <Tooltip label="Скопировать ссылку">
            <ActionIcon size='lg' variant='subtle' c='white' onClick={handleCopy}>
              <ContentCopyIcon fontSize='large' />
            </ActionIcon>
          </Tooltip>
        )}
        <Anchor fz={32} href={href} onClick={handleLinkClick} {...linkProps}>
          {content}
        </Anchor>
      </Group>

      <Modal
        opened={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="⚠️ Предупреждение о внешней ссылке"
        centered
        size='lg'
      >
        <Stack gap='md'>
          <Text>Будьте осторожны при переходе по неизвестным ссылкам. Продолжайте, только если доверяете этому источнику.</Text>
          <Text fw={500} c='orange'>
            {href}
          </Text>
          <Group justify='flex-end' gap='sm'>
            <Button variant='outline' onClick={() => setShowWarningModal(false)}>
              Отменить
            </Button>
            <Button color='orange' onClick={handleConfirmNavigation} leftSection={<OpenInNewIcon fontSize='small' />}>
              Открыть ссылку
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default LinkedTextUrl;
