import type { Action } from 'svelte/action';

export const logRender: Action<Element, string> = (el, k) => {
  console.log(`Render: ${k}`, el);
};
