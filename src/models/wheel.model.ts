import { Key } from 'react';

export interface WheelItem {
  name: string;
  id: Key;
  color: string;
  amount: number;
  image?: string; // URL или base64 изображения для сектора
}

export interface WheelItemWithAngle extends WheelItem {
  startAngle: number;
  endAngle: number;
}
