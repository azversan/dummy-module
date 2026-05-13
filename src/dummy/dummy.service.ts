import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DUMMY_MODULE_OPTIONS } from './dummy.constants';
import { DummyError, DummyModuleOptions } from './interfaces/dummy.interface';

@Injectable()
export class DummyService {
  constructor(@Inject(DUMMY_MODULE_OPTIONS) private readonly options: DummyModuleOptions) {}

  /**
   * Example method. Replace with actual business logic.
   */
  greet(name: string): string {
    return `Hello, ${name}!`;
  }

  /**
   * Throws an exception using the user-provided factory,
   * or falls back to HttpException if no factory exists.
   */
  throwError(error: DummyError): never {
    const factory = this.options.exceptionFactory ?? this.defaultExceptionFactory;
    throw factory(error);
  }

  private defaultExceptionFactory(this: void, error: DummyError): Error {
    return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
