import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { Group, Modal, Stack, Text } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import ImageIcon from '@mui/icons-material/Image';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BlockIcon from '@mui/icons-material/Block';
import './ImageLinkInput.scss';

interface ImageLinkInputProps {
  buttonTitle?: string;
  onChange: (imageLink: string) => void;
  onModalOpenChange?: (isOpened: boolean) => void;
  dialogTitle?: string;
  buttonClass?: string;
  isOpened?: boolean;
  onOpen?: () => void;
  hideButton?: boolean;
}

const ImageLinkInput: React.FC<ImageLinkInputProps> = ({
  buttonTitle,
  dialogTitle,
  buttonClass,
  onChange,
  onModalOpenChange,
  isOpened: externalIsOpened,
  onOpen,
  hideButton = false,
}) => {
  const [internalIsOpened, setInternalIsOpened] = useState(false);
  const [isCorrectUrl, setIsCorrectUrl] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const isInputOpened = externalIsOpened !== undefined ? externalIsOpened : internalIsOpened;

  const changeModalState = (isOpened: boolean): void => {
    if (externalIsOpened === undefined) {
      setInternalIsOpened(isOpened);
    }
    onModalOpenChange?.(isOpened);
  };

  const toggleDialog = (): void => {
    setIsCorrectUrl(true);
    if (isInputOpened) {
      changeModalState(false);
    } else {
      onOpen?.();
      changeModalState(true);
    }
  };

  const isImage = (url: string): Promise<Event> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = resolve;
      image.onerror = reject;
    });

  const handleLinkPaste = (e: any): void => {
    const imageUrl = e.clipboardData.getData('text');
    setTimeout(() => {
      setIsUploading(true);
      isImage(imageUrl)
        .then(() => {
          onChange(imageUrl);
          changeModalState(false);
        })
        .catch((e) => {
          setIsCorrectUrl(false);
        })
        .finally(() => setIsUploading(false));
    }, 170);
  };

  const handleFileUpload = ([file]: File[]): void => {
    const reader = new FileReader();

    reader.onloadend = (): void => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        changeModalState(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Modal opened={isInputOpened} onClose={toggleDialog} size='xl' centered title={dialogTitle}>
        <Stack gap='md' align='stretch' justify='center'>
          <Dropzone onDrop={handleFileUpload} maxFiles={1} maxSize={1000 * 1000 * 50} accept={['image/*']}>
            <Group justify='center' gap='xl' mih={120} style={{ pointerEvents: 'none' }}>
              <Dropzone.Accept>
                <AddPhotoAlternateIcon />
              </Dropzone.Accept>
              <Dropzone.Idle>
                <ImageIcon />
              </Dropzone.Idle>
              <Dropzone.Reject>
                <BlockIcon />
              </Dropzone.Reject>
              <div>
                <Text size='lg' inline>
                  Перетащите сюда файл или нажмите
                </Text>
              </div>
            </Group>
          </Dropzone>
          <Text size='xl' ta='center'>
            Или
          </Text>
          <TextField
            disabled={isUploading}
            onPaste={handleLinkPaste}
            placeholder='Вставьте ссылку на изображение...'
            error={!isCorrectUrl}
            helperText={!isCorrectUrl ? 'Неверная ссылка' : undefined}
            variant='outlined'
          />
        </Stack>
      </Modal>
      {!hideButton && (
        <Button variant='outlined' color='primary' onClick={toggleDialog} className={buttonClass}>
          {buttonTitle}
        </Button>
      )}
    </>
  );
};

export default ImageLinkInput;
