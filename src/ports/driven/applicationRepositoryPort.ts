import { Application } from '../../domain/application';
import { UsageApplication } from '../../domain/usage';

export interface ApplicationRepositoryPort {
  findAll(): Promise<Application[]>;
  findById(id: number): Promise<Application | null>;
  save(input: Omit<Application, 'id'>): Promise<Application>;
  findEveryUsage(id: number): Promise<UsageApplication[] | null>;
  deleteById(id: number): Promise<Application | null>;
  update(input: Application): Promise<Application>;
}