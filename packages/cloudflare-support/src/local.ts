import {
  WorkerEntrypoint,
  WorkflowEntrypoint,
  WorkflowStep,
  type WorkflowStepConfig,
} from 'cloudflare:workers';

class WorkflowStepLocal extends WorkflowStep {
  override do<T extends Rpc.Serializable<T>>(name: string, callback: () => Promise<T>): Promise<T>;
  override do<T extends Rpc.Serializable<T>>(
    name: string,
    config: WorkflowStepConfig,
    callback: () => Promise<T>,
  ): Promise<T>;
  override async do<T extends Rpc.Serializable<T>>(
    _name: string,
    configOrCallback: WorkflowStepConfig | (() => Promise<T>),
    maybeCallback?: () => Promise<T>,
  ): Promise<T> {
    if (maybeCallback) {
      return maybeCallback();
    }
    if (typeof configOrCallback === 'function') {
      return configOrCallback();
    }

    throw new Error('No callback');
  }
}

class WorkflowLocal<PARAMS = unknown> implements Workflow<PARAMS> {
  constructor(private entrypoint: WorkflowEntrypoint<unknown, PARAMS>) {}

  public async create(
    options?: WorkflowInstanceCreateOptions<PARAMS> | undefined,
  ): Promise<WorkflowInstance> {
    const now = new Date();
    const id = now.getTime().toString();
    await this.entrypoint.run(
      {
        payload: options?.params ?? ({} as PARAMS),
        instanceId: id,
        timestamp: now,
      },
      new WorkflowStepLocal(),
    );

    return { id } as WorkflowInstance;
  }

  public get(id: string): Promise<WorkflowInstance> {
    console.log({ id });
    throw new Error('Method not implemented.');
  }
  public createBatch(batch: WorkflowInstanceCreateOptions<PARAMS>[]): Promise<WorkflowInstance[]> {
    console.log({ batch });
    throw new Error('Method not implemented.');
  }
}

export const createWorkflowLocal = <Env>(
  entrypointClass: new (ctx: ExecutionContext, env: Env) => WorkflowEntrypoint<Env>,
  env: Env,
) => {
  const entryPoint = new entrypointClass({} as ExecutionContext, env);
  entryPoint['env'] = env;
  return new WorkflowLocal(entryPoint) as Workflow;
};

export const createWorkerEntrypointLocal = <
  T extends WorkerEntrypoint<unknown>,
  Env extends ConstructorParameters<new (...args: unknown[]) => T>[1],
>(
  entrypointClass: new (ctx: ExecutionContext, env: Env) => T,
  env: Env,
) => {
  const entryPoint = new entrypointClass({} as ExecutionContext, env);
  entryPoint['env'] = env;
  return entryPoint;
};
