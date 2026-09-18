import { Application } from '../../domain/application';
import { UsageApplication } from '../../domain/usage';

export interface ApplicationPort {
  listApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | null>;
  createApplication(input: Omit<Application, 'id'>): Promise<Application>;
  updateApplication(input: Application): Promise<Application>;
  deleteApplication(id: number): Promise<Application | null>;
}