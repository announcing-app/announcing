<button
  onclick={() => {
    throw new Error('Client Error Test');
  }}>Raise Error</button
>

<button
  onclick={async () => {
    await new Promise((resolve) => {
      window.setTimeout(resolve, 1000);
    });
    throw new Error('Client Promise Error Test');
  }}>Raise Promise Error</button
>
