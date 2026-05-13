import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';

/**
 * Error type produced by this module.
 * Adjust according to your package requirements.
 */
export type DummyError = {
  code: string;
  message: string;
};

/**
 * Factory used to transform DummyError into any exception the user wants.
 * By default it throws HttpException, but users can inject custom exceptions
 * such as AzversanInternalServerError.
 *
 * @example
 * // Use default (HttpException)
 * DummyModule.register({ options: {} })
 *
 * @example
 * // Use custom exception
 * DummyModule.register({
 *   options: {},
 *   exceptionFactory: (err) => new AzversanInternalServerError({
 *     error: err.code,
 *     message: err.message,
 *   }),
 * })
 */
export type DummyExceptionFactory = (error: DummyError) => Error;

/**
 * Synchronous configuration options for DummyModule.
 */
export interface DummyModuleOptions {
  /**
   * Custom exception factory.
   * If not provided, HttpException with status 500 will be used.
   */
  exceptionFactory?: DummyExceptionFactory;

  // Add more options here based on your package requirements
  // example: prefix?: string;
}

/**
 * Asynchronous configuration options for DummyModule.
 * Useful when options depend on ConfigService or other providers.
 */
export interface DummyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  useClass?: Type<DummyModuleOptionsFactory>;
  useExisting?: Type<DummyModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<DummyModuleOptions> | DummyModuleOptions;
}

/**
 * Interface for class-based async options (useClass / useExisting).
 */
export interface DummyModuleOptionsFactory {
  createDummyOptions(): Promise<DummyModuleOptions> | DummyModuleOptions;
}