<button
  onclick={() => {
    throw new Error('Client Error Test');
  }}>Raise Error</button
>

<button
  onclick={async () => {
    await new Promise((resolve, reject) => {
      window.setTimeout(() => {
        reject("new Error('Client Promise Error Test')");
      }, 100);
    });
  }}>Raise Promise Error</button
>
