type Callback = (entry: ResizeObserverEntry) => void;

export const createResizeObserverHelper = (callback: Callback) => {
  let observer: ResizeObserver | undefined = undefined;
  let entriesQueue: ResizeObserverEntry[] | undefined = undefined;

  const observe = (el: Element) => {
    if (!observer) {
      observer = new ResizeObserver((entries) => {
        if (entriesQueue) {
          entriesQueue.push(...entries);
        } else {
          entriesQueue = entries;
          // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#observation_errors
          requestAnimationFrame(() => {
            if (entriesQueue) {
              for (const entry of entriesQueue) {
                callback(entry);
              }
              entriesQueue = undefined;
            }
          });
        }
      });
    }

    observer.observe(el);
  };

  const unobserve = (el: Element) => {
    observer?.unobserve(el);
  };

  const disconnect = () => {
    observer?.disconnect();
    observer = undefined;
  };

  return {
    observe,
    unobserve,
    disconnect,
  };
};
