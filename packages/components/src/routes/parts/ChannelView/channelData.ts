import { faker } from '@faker-js/faker';
import { addDays } from 'date-fns';

faker.seed(100);

type Announcement = {
  headerImage?: string | undefined;
  title?: string | undefined;
  body: string;
  images?: string[] | undefined;
  updatedAt: number;
  createdAt: number;
};

const genDate = (n: number) => {
  return addDays('2026-01-01T00:11:22', n * -1).getTime();
};

const genData = (): Map<string, Announcement | undefined> => {
  const data = new Map<string, Announcement | undefined>();

  data.set('1', {
    headerImage: '/assets/duck-7713310_1280x853.jpg',
    title: 'Landscape header',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(1),
    createdAt: genDate(1),
  });

  data.set('2', {
    headerImage: '/assets/duck-7829778_960x1280.jpg',
    title: 'Portrait header',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(2),
    createdAt: genDate(2),
  });

  data.set('3', {
    headerImage: '/assets/ducklings-1853178_1280x989.jpg',
    title: 'Landscape header is more boxy',
    body: faker.lorem.paragraphs(),
    updatedAt: genDate(3),
    createdAt: genDate(3),
  });

  data.set('4', undefined);

  data.set('5', {
    title: 'Images',
    body: faker.lorem.paragraphs(),
    images: [
      '/assets/lemons-2039830_1280x848.jpg',
      '/assets/lime-6215762_854x1280.jpg',
      '/assets/lemon-8293725_1280x1280.jpg',
      '/assets/lemon-25342_150x150.png',
    ],
    updatedAt: genDate(5),
    createdAt: genDate(5),
  });

  data.set('6', {
    title: 'Landscape single image',
    body: faker.lorem.paragraphs(),
    images: ['/assets/duck-7713310_1280x853.jpg'],
    updatedAt: genDate(6),
    createdAt: genDate(6),
  });

  data.set('7', {
    title: 'Portrait single image',
    body: faker.lorem.paragraphs(),
    images: ['/assets/duck-7829778_960x1280.jpg'],
    updatedAt: genDate(7),
    createdAt: genDate(7),
  });

  data.set('8', {
    title: 'Landscape single image is more boxy',
    body: faker.lorem.paragraphs(),
    images: ['/assets/ducklings-1853178_1280x989.jpg'],
    updatedAt: genDate(8),
    createdAt: genDate(8),
  });

  data.set('9', {
    title: 'Small single image',
    body: faker.lorem.paragraphs(),
    images: ['/assets/lemon-25342_150x150.png'],
    updatedAt: genDate(9),
    createdAt: genDate(9),
  });

  for (let i = 0; i < 100; i++) {
    data.set(10 + i + '', {
      title: faker.lorem.paragraph(),
      body: faker.lorem.paragraphs(),
      updatedAt: genDate(i + 10),
      createdAt: genDate(i + 10),
    });
  }

  return data;
};

export const channelData = genData();
