import { ToasterStatus } from '../constants/toaster.constants';
import { Observable } from 'rxjs';

export interface ToasterData {
  status: ToasterStatus;
  message: string;
  action?: string;
}

export interface ToasterResult {
  onAction?: () => Observable<void>;
}
