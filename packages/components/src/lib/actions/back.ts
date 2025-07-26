import { afterNavigate } from '$app/navigation';
import type { Action } from 'svelte/action';

/*
 Save the 'from' href of afterNavigate in page.state for prioritized use.
 For example, consider a navigation sequence of `/1` -> `/2` -> `/3` and then a back navigation `/3` -> `/2` -> `/1`.
 When returning from `/3` to `/2`, it's clear that `/3` came from `/2` based on afterNavigate's parameters.
 However, when navigating back from `/2` to `/1`, afterNavigate's 'from' will be `/3`, losing the information that `/2` was initially reached from `/1`.
 To address this, the state saves the original `/1` -> `/2` transition.
 This allows the code to correctly judge when history.back can be used to navigate back to `/1` from `/2`.
*/
export const setupBack = () => {
  afterNavigate((params) => {
    const fromHref: string | undefined = history.state?.fromHref;
    if (fromHref) {
      return;
    }

    if (params.from) {
      // Sveltekit state does not load after reload
      // https://github.com/sveltejs/kit/issues/11956
      history.replaceState({ ...history.state, fromHref: params.from.url.href }, '');
    }
  });
};

export const back: Action<HTMLAnchorElement> = (el) => {
  const clickHandler = (event: MouseEvent) => {
    const fromHref: string | undefined = history.state?.fromHref;
    if (fromHref && fromHref === el.href) {
      event.preventDefault();
      history.back();
    }
  };

  el.addEventListener('click', clickHandler);

  return {
    destroy: () => {
      el.removeEventListener('click', clickHandler);
    },
  };
};
