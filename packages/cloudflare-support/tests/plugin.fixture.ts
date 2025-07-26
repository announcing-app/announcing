import { WorkflowEntrypoint } from 'cloudflare:workers';
import { createWorkflowLocal } from '../src/local';

class TestWorkflowEntrypoint extends WorkflowEntrypoint {}

export const main = () => {
  createWorkflowLocal(TestWorkflowEntrypoint, {});
};
