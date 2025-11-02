import { PermanentParticipantsConfig } from '@models/permanentParticipants.model';

/**
 * Дефолтный конфиг постоянных участников
 * Используется когда у пользователя еще нет сохраненных данных
 */
export const DEFAULT_PERMANENT_PARTICIPANTS_CONFIG: PermanentParticipantsConfig = {
  participants: [
    {
      name: 'Вова',
      amount: 1,
      id: '093729f9-5639-47ae-8d82-77bcfda04d95',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031973394,
          date: '02.11.2025, 00:19:33',
        },
        {
          timestamp: 1762031985728,
          date: '02.11.2025, 00:19:45',
        },
        {
          timestamp: 1762032003345,
          date: '02.11.2025, 00:20:03',
        },
        {
          timestamp: 1762032027662,
          date: '02.11.2025, 00:20:27',
        },
        {
          timestamp: 1762032098531,
          date: '02.11.2025, 00:21:38',
        },
        {
          timestamp: 1762033577068,
          date: '02.11.2025, 00:46:17',
        },
        {
          timestamp: 1762033802842,
          date: '02.11.2025, 00:50:02',
        },
        {
          timestamp: 1762033825958,
          date: '02.11.2025, 00:50:25',
        },
        {
          timestamp: 1762033827890,
          date: '02.11.2025, 00:50:27',
        },
        {
          timestamp: 1762033830124,
          date: '02.11.2025, 00:50:30',
        },
        {
          timestamp: 1762034085513,
          date: '02.11.2025, 00:54:45',
        },
        {
          timestamp: 1762101571307,
          date: '02.11.2025, 19:39:31',
        },
        {
          timestamp: 1762101607459,
          date: '02.11.2025, 19:40:07',
        },
        {
          timestamp: 1762101612825,
          date: '02.11.2025, 19:40:12',
        },
      ],
      color: '#fdfd',
      image:
        'data:image/jpeg;base64,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',
    },
    {
      name: 'Андрей',
      amount: 1,
      id: 'f14a47f6-56b8-44c1-af54-a018bf30744d',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031861358,
          date: '02.11.2025, 00:17:41',
        },
        {
          timestamp: 1762031863758,
          date: '02.11.2025, 00:17:43',
        },
        {
          timestamp: 1762031958226,
          date: '02.11.2025, 00:19:18',
        },
        {
          timestamp: 1762031969959,
          date: '02.11.2025, 00:19:29',
        },
        {
          timestamp: 1762031980895,
          date: '02.11.2025, 00:19:40',
        },
        {
          timestamp: 1762031990427,
          date: '02.11.2025, 00:19:50',
        },
        {
          timestamp: 1762031994961,
          date: '02.11.2025, 00:19:54',
        },
        {
          timestamp: 1762032011378,
          date: '02.11.2025, 00:20:11',
        },
        {
          timestamp: 1762032021078,
          date: '02.11.2025, 00:20:21',
        },
        {
          timestamp: 1762033804992,
          date: '02.11.2025, 00:50:04',
        },
        {
          timestamp: 1762034081030,
          date: '02.11.2025, 00:54:41',
        },
        {
          timestamp: 1762034379171,
          date: '02.11.2025, 00:59:39',
        },
        {
          timestamp: 1762034537291,
          date: '02.11.2025, 01:02:17',
        },
        {
          timestamp: 1762034543808,
          date: '02.11.2025, 01:02:23',
        },
        {
          timestamp: 1762101546874,
          date: '02.11.2025, 19:39:06',
        },
        {
          timestamp: 1762101554775,
          date: '02.11.2025, 19:39:14',
        },
        {
          timestamp: 1762101583776,
          date: '02.11.2025, 19:39:43',
        },
      ],
    },
    {
      name: 'Саша',
      amount: 1,
      id: '3473c78b-511e-4082-851d-7dbe5db5cd85',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031975028,
          date: '02.11.2025, 00:19:35',
        },
        {
          timestamp: 1762031987328,
          date: '02.11.2025, 00:19:47',
        },
        {
          timestamp: 1762032004911,
          date: '02.11.2025, 00:20:04',
        },
        {
          timestamp: 1762032012977,
          date: '02.11.2025, 00:20:12',
        },
        {
          timestamp: 1762032077030,
          date: '02.11.2025, 00:21:17',
        },
        {
          timestamp: 1762032081396,
          date: '02.11.2025, 00:21:21',
        },
        {
          timestamp: 1762032084430,
          date: '02.11.2025, 00:21:24',
        },
        {
          timestamp: 1762032093646,
          date: '02.11.2025, 00:21:33',
        },
        {
          timestamp: 1762033806526,
          date: '02.11.2025, 00:50:06',
        },
        {
          timestamp: 1762033888191,
          date: '02.11.2025, 00:51:28',
        },
        {
          timestamp: 1762034079097,
          date: '02.11.2025, 00:54:39',
        },
        {
          timestamp: 1762034186800,
          date: '02.11.2025, 00:56:26',
        },
        {
          timestamp: 1762034364153,
          date: '02.11.2025, 00:59:24',
        },
        {
          timestamp: 1762034367623,
          date: '02.11.2025, 00:59:27',
        },
        {
          timestamp: 1762034583209,
          date: '02.11.2025, 01:03:03',
        },
        {
          timestamp: 1762101309087,
          date: '02.11.2025, 19:35:09',
        },
        {
          timestamp: 1762101493924,
          date: '02.11.2025, 19:38:13',
        },
        {
          timestamp: 1762101549873,
          date: '02.11.2025, 19:39:09',
        },
        {
          timestamp: 1762101560391,
          date: '02.11.2025, 19:39:20',
        },
        {
          timestamp: 1762101563274,
          date: '02.11.2025, 19:39:23',
        },
        {
          timestamp: 1762101621306,
          date: '02.11.2025, 19:40:21',
        },
        {
          timestamp: 1762102449401,
          date: '02.11.2025, 19:54:09',
        },
      ],
    },
    {
      name: 'Валя',
      amount: 1,
      id: '89782b81-c01c-4d19-a37d-4b296d842800',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031862591,
          date: '02.11.2025, 00:17:42',
        },
        {
          timestamp: 1762031988894,
          date: '02.11.2025, 00:19:48',
        },
        {
          timestamp: 1762032022411,
          date: '02.11.2025, 00:20:22',
        },
        {
          timestamp: 1762032075462,
          date: '02.11.2025, 00:21:15',
        },
        {
          timestamp: 1762032092113,
          date: '02.11.2025, 00:21:32',
        },
        {
          timestamp: 1762033556986,
          date: '02.11.2025, 00:45:56',
        },
        {
          timestamp: 1762033790826,
          date: '02.11.2025, 00:49:50',
        },
        {
          timestamp: 1762034131815,
          date: '02.11.2025, 00:55:31',
        },
        {
          timestamp: 1762034540191,
          date: '02.11.2025, 01:02:20',
        },
        {
          timestamp: 1762034547124,
          date: '02.11.2025, 01:02:27',
        },
        {
          timestamp: 1762101568574,
          date: '02.11.2025, 19:39:28',
        },
        {
          timestamp: 1762101574207,
          date: '02.11.2025, 19:39:34',
        },
        {
          timestamp: 1762101703043,
          date: '02.11.2025, 19:41:43',
        },
      ],
    },
    {
      name: 'Антон',
      amount: 1,
      id: 'c92225fd-e34f-4a85-ad56-8b9ed1ff125d',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031962360,
          date: '02.11.2025, 00:19:22',
        },
        {
          timestamp: 1762031964362,
          date: '02.11.2025, 00:19:24',
        },
        {
          timestamp: 1762031971794,
          date: '02.11.2025, 00:19:31',
        },
        {
          timestamp: 1762031982494,
          date: '02.11.2025, 00:19:42',
        },
        {
          timestamp: 1762031991994,
          date: '02.11.2025, 00:19:51',
        },
        {
          timestamp: 1762031998229,
          date: '02.11.2025, 00:19:58',
        },
        {
          timestamp: 1762032078530,
          date: '02.11.2025, 00:21:18',
        },
        {
          timestamp: 1762032080063,
          date: '02.11.2025, 00:21:20',
        },
        {
          timestamp: 1762032085963,
          date: '02.11.2025, 00:21:25',
        },
        {
          timestamp: 1762032096997,
          date: '02.11.2025, 00:21:36',
        },
        {
          timestamp: 1762033260000,
          date: '02.11.2025, 00:41:00',
        },
        {
          timestamp: 1762033612469,
          date: '02.11.2025, 00:46:52',
        },
        {
          timestamp: 1762033800958,
          date: '02.11.2025, 00:50:00',
        },
        {
          timestamp: 1762033821723,
          date: '02.11.2025, 00:50:21',
        },
        {
          timestamp: 1762033823858,
          date: '02.11.2025, 00:50:23',
        },
        {
          timestamp: 1762033885591,
          date: '02.11.2025, 00:51:25',
        },
        {
          timestamp: 1762033893775,
          date: '02.11.2025, 00:51:33',
        },
        {
          timestamp: 1762034188833,
          date: '02.11.2025, 00:56:28',
        },
        {
          timestamp: 1762034370259,
          date: '02.11.2025, 00:59:30',
        },
        {
          timestamp: 1762034377438,
          date: '02.11.2025, 00:59:37',
        },
        {
          timestamp: 1762101557525,
          date: '02.11.2025, 19:39:17',
        },
        {
          timestamp: 1762101577108,
          date: '02.11.2025, 19:39:37',
        },
      ],
    },
    {
      name: 'Костя',
      amount: 1,
      id: '47e61d42-1c32-407e-8cc1-d9d5e8c4aee3',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762032007678,
          date: '02.11.2025, 00:20:07',
        },
        {
          timestamp: 1762033819325,
          date: '02.11.2025, 00:50:19',
        },
        {
          timestamp: 1762034225169,
          date: '02.11.2025, 00:57:05',
        },
        {
          timestamp: 1762034373538,
          date: '02.11.2025, 00:59:33',
        },
        {
          timestamp: 1762034375671,
          date: '02.11.2025, 00:59:35',
        },
        {
          timestamp: 1762034545441,
          date: '02.11.2025, 01:02:25',
        },
        {
          timestamp: 1762034578110,
          date: '02.11.2025, 01:02:58',
        },
        {
          timestamp: 1762034588226,
          date: '02.11.2025, 01:03:08',
        },
        {
          timestamp: 1762035882242,
          date: '02.11.2025, 01:24:42',
        },
        {
          timestamp: 1762101531008,
          date: '02.11.2025, 19:38:51',
        },
        {
          timestamp: 1762101565907,
          date: '02.11.2025, 19:39:25',
        },
        {
          timestamp: 1762101589891,
          date: '02.11.2025, 19:39:49',
        },
        {
          timestamp: 1762102445584,
          date: '02.11.2025, 19:54:05',
        },
      ],
    },
    {
      name: 'Никита',
      amount: 1,
      id: 'ad68beaa-d24c-4a02-93e0-bc5bf0e80c34',
      enabled: true,
      winHistory: [
        {
          timestamp: 1762031968261,
          date: '02.11.2025, 00:19:28',
        },
        {
          timestamp: 1762031979193,
          date: '02.11.2025, 00:19:39',
        },
        {
          timestamp: 1762031984228,
          date: '02.11.2025, 00:19:44',
        },
        {
          timestamp: 1762031996694,
          date: '02.11.2025, 00:19:56',
        },
        {
          timestamp: 1762032100031,
          date: '02.11.2025, 00:21:40',
        },
        {
          timestamp: 1762033798791,
          date: '02.11.2025, 00:49:58',
        },
        {
          timestamp: 1762034629176,
          date: '02.11.2025, 01:03:49',
        },
        {
          timestamp: 1762101264372,
          date: '02.11.2025, 19:34:24',
        },
        {
          timestamp: 1762101296954,
          date: '02.11.2025, 19:34:56',
        },
        {
          timestamp: 1762101586791,
          date: '02.11.2025, 19:39:46',
        },
        {
          timestamp: 1762101602208,
          date: '02.11.2025, 19:40:02',
        },
        {
          timestamp: 1762101610090,
          date: '02.11.2025, 19:40:10',
        },
        {
          timestamp: 1762101615607,
          date: '02.11.2025, 19:40:15',
        },
      ],
    },
  ],
  version: '1.0',
};

