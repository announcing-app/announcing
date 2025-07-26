import { createLocalBindings } from '@announcing/cloudflare-support/localBindings';
import { createRemoteBindings } from '@announcing/cloudflare-support/remoteBindings';
import { faker } from '@faker-js/faker';
import { addDays } from 'date-fns';
import MockDate from 'mockdate';
import { openAsBlob } from 'node:fs';
import { parseArgs } from 'node:util';
import { createDB } from '../src';

const IMAGE_DIR = '../components/public/assets/';

const channelData = {
  name: 'Aether Dynamics Corporation',
  desc: 'Aether Dynamics Corporation is at the forefront of cutting-edge technology, pioneering advancements in energy solutions and sustainable innovation.\nJoin us as we transform the future with dynamic, visionary science.',
};

faker.seed(100);

const loadBlob = (name: string) => {
  const type = name.endsWith('.png') ? 'image/png' : 'image/jpeg';

  return openAsBlob(`${IMAGE_DIR}/${name}`, { type });
};

const genDate = (n: number) => {
  return addDays('2026-02-01T00:11:22', n).getTime();
};

const generate = async (userID: string, channelID: string, remote: boolean) => {
  const b = remote ? await createRemoteBindings() : await createLocalBindings();
  const db = createDB(b);

  try {
    {
      const channel = await db.getChannel({ userID, channelID });
      if (channel) {
        await db.deleteChannel({ userID, channelID, updatedAt: channel.updatedAt });
      }
    }

    {
      const date = new Date('2025-01-01T11:59:00Z').getTime();
      MockDate.set(date);
      const icon = await loadBlob('logo.png');
      await db.createChannel({
        userID,
        channelID,
        name: channelData.name,
        desc: channelData.desc,
        icon,
      });
    }

    type Announcement = {
      headerImage?: Blob | undefined;
      title?: string | undefined;
      body: string;
      images?: Blob[] | undefined;
    };
    const data = new Map<string, Announcement>();

    data.set('1', {
      headerImage: await loadBlob('duck-7713310_1280x853.jpg'),
      title: 'Landscape header',
      body: faker.lorem.paragraphs(),
    });

    data.set('2', {
      headerImage: await loadBlob('duck-7829778_960x1280.jpg'),
      title: 'Portrait header',
      body: faker.lorem.paragraphs(),
    });

    data.set('3', {
      headerImage: await loadBlob('ducklings-1853178_1280x989.jpg'),
      title: 'Landscape header is more boxy',
      body: faker.lorem.paragraphs(),
    });

    data.set('5', {
      title: 'Images',
      body: faker.lorem.paragraphs(),
      images: [
        await loadBlob('lemons-2039830_1280x848.jpg'),
        await loadBlob('lime-6215762_854x1280.jpg'),
        await loadBlob('lemon-8293725_1280x1280.jpg'),
        await loadBlob('lemon-25342_150x150.png'),
      ],
    });

    data.set('6', {
      title: 'Landscape single image',
      body: faker.lorem.paragraphs(),
      images: [await loadBlob('duck-7713310_1280x853.jpg')],
    });

    data.set('7', {
      title: 'Portrait single image',
      body: faker.lorem.paragraphs(),
      images: [await loadBlob('duck-7829778_960x1280.jpg')],
    });

    data.set('8', {
      title: 'Landscape single image is more boxy',
      body: faker.lorem.paragraphs(),
      images: [await loadBlob('ducklings-1853178_1280x989.jpg')],
    });

    data.set('9', {
      title: 'Small single image',
      body: faker.lorem.paragraphs(),
      images: [await loadBlob('lemon-25342_150x150.png')],
    });

    for (let i = 0; i < 100; i++) {
      data.set(10 + i + '', {
        title: faker.lorem.sentence(),
        body: faker.lorem.lines(),
      });
    }

    for (const [index, a] of [...data.values()].reverse().entries()) {
      await db.addAnnouncement({ userID, channelID, createdAt: genDate(index), ...a });
      console.log(`[${index + 1}/${data.size}] done.`);
    }

    console.log('Finished.');
  } finally {
    await b.dispose();
  }
};

const main = async () => {
  const parsed = parseArgs({
    options: {
      userID: {
        type: 'string',
        default: 'credentials:test_user01',
      },
      channelID: {
        type: 'string',
        default: '9901',
      },
      remote: {
        type: 'boolean',
        default: false,
      },
    },
  });

  const { userID, channelID, remote } = parsed.values;

  await generate(userID, channelID, remote);
};

await main();
