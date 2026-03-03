export type CorelStatus = 'compatible' | 'warning' | 'incompatible';

export interface CorelValidation {
  status: CorelStatus;
  messages: string[];
}
