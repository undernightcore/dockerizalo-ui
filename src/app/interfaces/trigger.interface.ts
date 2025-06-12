export interface TriggerInterface {
  id: string;
  name: string;
  appId: string;
}

export type CreateTriggerInterface = Omit<TriggerInterface, 'id' | 'appId'>;
