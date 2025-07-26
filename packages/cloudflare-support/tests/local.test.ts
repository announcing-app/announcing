import {
  WorkerEntrypoint,
  WorkflowEntrypoint,
  WorkflowStep,
  type WorkflowEvent,
} from 'cloudflare:workers';
import { expect, it } from 'vitest';
import { createWorkerEntrypointLocal, createWorkflowLocal } from '../src/local';

it('workflow', async () => {
  let a = 0;

  class TestWorkflowEntrypoint extends WorkflowEntrypoint<{ INC: (n: number) => number }> {
    override async run(event: Readonly<WorkflowEvent<{ n: number }>>, step: WorkflowStep) {
      await step.do('test', () => {
        a = this.env.INC(event.payload.n);
        return Promise.resolve();
      });
    }
  }

  const params = { n: 1 };
  const workflow = createWorkflowLocal(TestWorkflowEntrypoint, { INC: (n) => n + 1 });
  await workflow.create({ params });
  expect(a).toBe(2);
});

it('workerEntrypoint', () => {
  class TestWorkerEntrypoint extends WorkerEntrypoint<{ INC: (n: number) => number }> {
    inc(n: number) {
      return this.env.INC(n);
    }
  }

  const entrypoint = createWorkerEntrypointLocal(TestWorkerEntrypoint, { INC: (n) => n + 1 });
  expect(entrypoint.inc(1)).toBe(2);
});
