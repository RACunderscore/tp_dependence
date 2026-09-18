import { Application } from '../domain/application';
import { UsageApplication } from '../domain/usage';
import { ApplicationRepositoryPort } from '../ports/driven/applicationRepositoryPort';
import { ApplicationPort } from "../ports/driving/applicationPort";

export class ApplicationService implements ApplicationPort {
  constructor(private repo: ApplicationRepositoryPort) {}

  async listApplications(): Promise<Application[]>{
    return this.repo.findAll();
  }

  async getApplication(id: number): Promise<Application | null>{
    return this.repo.findById(id);
  }
  
  async createApplication(input: Omit<Application, 'id'>): Promise<Application>{
    return this.repo.save(input)
  }
  
  async updateApplication(input: Application): Promise<Application>{
    return this.repo.update(input)
  }
  
  async deleteApplication(id: number): Promise<Application | null>{
    return this.repo.deleteById(id);
  }
}
