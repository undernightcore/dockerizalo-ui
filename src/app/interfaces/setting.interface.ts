export type SettingInterface =
  | IntegerSettingInterface
  | StringSettingInterface
  | BooleanSettingInterface;

export interface IntegerSettingInterface {
  id: string;
  name: string;
  type: 'INTEGER';
  value: number;
  min?: number;
  max?: number;
}

export interface StringSettingInterface {
  id: string;
  name: string;
  type: 'STRING';
  value: string;
  min?: number;
  max?: number;
}

export interface BooleanSettingInterface {
  id: string;
  name: string;
  type: 'BOOLEAN';
  value: boolean;
}
