import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { DUMMY_MODULE_OPTIONS } from './dummy.constants';
import { DummyService } from './dummy.service';
import { DummyModuleAsyncOptions, DummyModuleOptions, DummyModuleOptionsFactory } from './interfaces/dummy.interface';

@Global()
@Module({})
export class DummyModule {
  /**
   * Synchronous configuration.
   *
   * @example
   * DummyModule.register({
   *   exceptionFactory: (err) =>
   *     new AzversanInternalServerError({
   *       error: err.code,
   *       message: err.message,
   *     }),
   * })
   */
  static register(options: DummyModuleOptions = {}): DynamicModule {
    return {
      module: DummyModule,
      providers: [
        {
          provide: DUMMY_MODULE_OPTIONS,
          useValue: options,
        },
        DummyService,
      ],
      exports: [DummyService],
    };
  }

  /**
   * Asynchronous configuration — useful when options depend on
   * other providers such as ConfigService.
   *
   * @example
   * DummyModule.registerAsync({
   *   inject: [ConfigService],
   *   useFactory: (config: ConfigService) => ({
   *     exceptionFactory: (err) =>
   *       new AzversanInternalServerError({
   *         error: err.code,
   *         message: err.message,
   *       }),
   *   }),
   * })
   */
  static registerAsync(asyncOptions: DummyModuleAsyncOptions): DynamicModule {
    return {
      module: DummyModule,
      imports: asyncOptions.imports ?? [],
      providers: [...this.createAsyncProviders(asyncOptions), DummyService],
      exports: [DummyService],
    };
  }

  private static createAsyncProviders(asyncOptions: DummyModuleAsyncOptions): Provider[] {
    if (asyncOptions.useFactory) {
      return [
        {
          provide: DUMMY_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: asyncOptions.inject ?? [],
        },
      ];
    }

    if (asyncOptions.useClass) {
      return [
        {
          provide: DUMMY_MODULE_OPTIONS,
          useFactory: async (factory: DummyModuleOptionsFactory) => factory.createDummyOptions(),
          inject: [asyncOptions.useClass],
        },
        {
          provide: asyncOptions.useClass,
          useClass: asyncOptions.useClass,
        },
      ];
    }

    if (asyncOptions.useExisting) {
      return [
        {
          provide: DUMMY_MODULE_OPTIONS,
          useFactory: async (factory: DummyModuleOptionsFactory) => factory.createDummyOptions(),
          inject: [asyncOptions.useExisting],
        },
      ];
    }

    throw new Error('DummyModule.registerAsync() requires useFactory, useClass, or useExisting.');
  }
}
