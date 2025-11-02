// Импорт музыкальных файлов
import derevnjaDurakovTrack from '@assets/mp3/derevnja-durakov-soundtrack-kalambur.mp3';
import bennyHillTrack from '@assets/mp3/Benny_Hill_Show_-_Soundtrack_(SkySound.cc).mp3';
import veselayaPesenkaTrack from '@assets/mp3/veselaya_pesenka_na_zvonok_tyryam_tyryarim_tam_tyryam.mp3';

export interface MusicTrack {
  id: string;
  name: string;
  file: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'derevnja-durakov',
    name: 'Деревня дураков - Каламбур',
    file: derevnjaDurakovTrack,
  },
  {
    id: 'benny-hill',
    name: 'Benny Hill Show - Soundtrack',
    file: bennyHillTrack,
  },
  {
    id: 'veselaya-pesenka',
    name: 'Веселая песенка - Тырям-тырярим-там-тырям',
    file: veselayaPesenkaTrack,
  },
];

export const RANDOM_TRACK_ID = 'random';

export const getRandomTrack = (): MusicTrack => {
  const randomIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
  return MUSIC_TRACKS[randomIndex];
};

export const getTrackById = (id: string | null | undefined): string | null => {
  if (!id) return null;
  
  if (id === RANDOM_TRACK_ID) {
    return getRandomTrack().file;
  }
  
  const track = MUSIC_TRACKS.find(t => t.id === id);
  return track?.file || null;
};

