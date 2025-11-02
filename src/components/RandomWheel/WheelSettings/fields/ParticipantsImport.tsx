import React, { useState } from 'react';
import { Button } from '@mantine/core';

import PermanentParticipantsModal from './PermanentParticipantsModal';

const ParticipantsImportField = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button variant='outline' onClick={() => setModalOpen(true)} fullWidth>
        Редактировать список участников
      </Button>
      <PermanentParticipantsModal opened={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default ParticipantsImportField;
