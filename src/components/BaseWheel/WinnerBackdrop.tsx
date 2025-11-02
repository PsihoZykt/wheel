import React, { Key } from 'react';

import WinnerBackdropName from '@components/BaseWheel/WinnerBackdropName.tsx';

interface WinnerBackdropProps {
  name: string;
  id: Key;
  winnerName?: string;
  onDelete?: () => void;
  dropOut?: boolean;
}

const WinnerBackdrop = (props: WinnerBackdropProps) => {
  const { name, winnerName, dropOut } = props;

  return (
    <div style={{ pointerEvents: 'all' }} className='wheel-winner'>
      <WinnerBackdropName name={name} winnerName={winnerName} dropout={dropOut} />
    </div>
  );
};

export default WinnerBackdrop;
