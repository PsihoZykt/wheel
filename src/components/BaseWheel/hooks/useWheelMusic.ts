import { useRef } from 'react';

import { getTrackById, RANDOM_TRACK_ID } from '@constants/music.ts';
import endSpinSound from '@assets/mp3/endSpinning/in-the-mouth-of-this-casino.mp3';

interface UseWheelMusicParams {
  musicTrackId?: string | null;
  enabled?: boolean;
}

interface UseWheelMusicResult {
  playMusic: () => void;
  stopMusic: () => void;
  playEndSound: () => void;
}

/**
 * Хук для управления воспроизведением музыки во время вращения колеса
 */
export const useWheelMusic = ({ musicTrackId, enabled = true }: UseWheelMusicParams = {}): UseWheelMusicResult => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);

  // Получаем ID трека из параметров или localStorage
  const storedTrackId = localStorage.getItem('wheelMusicTrackId');
  const trackId = musicTrackId || storedTrackId || RANDOM_TRACK_ID;

  const playMusic = () => {
    if (!enabled) return;

    // Останавливаем предыдущее воспроизведение, если есть
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Для случайного режима выбираем новый трек при каждом вызове playMusic
    const musicFile = getTrackById(trackId);

    if (!musicFile) return;

    // Создаем новый аудио элемент
    const audio = new Audio(musicFile);
    audio.loop = true; // Зацикливаем, если вращение долгое
    audio.volume = 0.3; // Устанавливаем громкость 30%
    audioRef.current = audio;

    // Начинаем воспроизведение
    audio.play().catch((error) => {
      console.warn('Не удалось воспроизвести музыку:', error);
    });
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const playEndSound = () => {
    if (!enabled) return; // Не воспроизводим, если музыка отключена

    // Останавливаем предыдущий звук окончания, если есть
    if (endSoundRef.current) {
      endSoundRef.current.pause();
      endSoundRef.current = null;
    }

    // Создаем новый аудио элемент для звука окончания
    const endAudio = new Audio(endSpinSound);
    endAudio.volume = 0.5; // Устанавливаем громкость 50%
    endSoundRef.current = endAudio;

    // Воспроизводим звук окончания
    endAudio.play().catch((error) => {
      console.warn('Не удалось воспроизвести звук окончания:', error);
    });

    // Очищаем ссылку после завершения воспроизведения
    endAudio.addEventListener('ended', () => {
      endSoundRef.current = null;
    });
  };

  return { playMusic, stopMusic, playEndSound };
};
