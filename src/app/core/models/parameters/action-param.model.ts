import { ActionType } from '@pages/action/action.config';

export interface ActionParameter {
  type: ActionType;
  icon: string;
  title: string;
  description: string;
  id: number;
}
