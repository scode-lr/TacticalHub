import { Injectable } from '@angular/core';
import { Parameter } from '@core/models/parameters/parameter.model';
import { mockParameters } from '@mocks/parameters.mock';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {
  private readonly parameters: Map<string, Parameter> = new Map(mockParameters);

  getParameter<T = unknown>(id: string): Parameter<T> | undefined {
    return this.parameters.get(id) as Parameter<T> | undefined;
  }

  getParameterValue<T = unknown>(id: string): T | undefined {
    return this.parameters.get(id)?.value as T | undefined;
  }

  getAllParameters(): Parameter[] {
    return Array.from(this.parameters.values());
  }

  setParameter<T = unknown>(parameter: Parameter<T>): void {
    this.parameters.set(parameter.id, {
      ...parameter,
      timeModified: new Date()
    });
  }

  updateParameterValue<T = unknown>(id: string, value: T): boolean {
    const parameter = this.parameters.get(id);
    if (!parameter) {
      return false;
    }

    this.parameters.set(id, {
      ...parameter,
      value,
      timeModified: new Date()
    });
    return true;
  }

  hasParameter(id: string): boolean {
    return this.parameters.has(id);
  }
}
