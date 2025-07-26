/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from 'node:fs';

import { messages } from './messages';

const generate = () => {
  const extract = (o: any, lang: string, x: any) => {
    for (const [k, _v] of Object.entries(o)) {
      const v = _v as any;
      if ('en' in (v as any)) {
        x[k] = v[lang];
      } else {
        if (!x[k]) {
          x[k] = {};
        }
        extract(v, lang, x[k]);
      }
    }
  };

  const languages = ['en', 'ja'];

  languages.forEach((lang) => {
    const x = {};
    extract(messages, lang, x);

    const translation = lang === 'en' ? 'BaseTranslation' : 'Translation';
    const langMessages = JSON.stringify(x);

    const indexTs = `
      import type { ${translation} } from '../i18n-types';

      const ${lang} = ${langMessages} satisfies ${translation};

      export default ${lang};
    `;

    writeFileSync(`src/i18n/${lang}/index.ts`, indexTs);
  });
};

generate();
