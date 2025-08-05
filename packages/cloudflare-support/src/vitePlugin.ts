import type { PluginOption } from 'vite';

export const virtualCloudflareWorkers: PluginOption = {
  name: 'virtual-cloudflare-workers',
  resolveId(id) {
    if (id === 'cloudflare:workers') {
      return '\0cloudflare:workers';
    } else if (id === 'cloudflare:email') {
      return '\0cloudflare:email';
    }
    return;
  },
  load(id) {
    if (id === '\0cloudflare:workers') {
      return [
        'export class WorkflowEntrypoint {}',
        'export class WorkflowStep {}',
        'export class WorkerEntrypoint {}',
      ].join('\n');
    } else if (id === '\0cloudflare:email') {
      return ['export class EmailMessage {}'].join('\n');
    }
    return;
  },
};
