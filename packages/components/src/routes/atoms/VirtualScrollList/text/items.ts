import { faker } from '@faker-js/faker';

const COUNT = 100;

const genItems = () => {
  faker.seed(1192);

  const result = new Map<number, { title: string; body: string }>();

  for (let i = 1; i <= COUNT; i++) {
    result.set(i, {
      title: `[${i}] ${faker.lorem.sentence({
        min: 5,
        max: 10,
      })}`,
      body: faker.lorem.paragraphs({ min: 3, max: 20 }),
    });
  }

  return result;
};

export const items = genItems();
