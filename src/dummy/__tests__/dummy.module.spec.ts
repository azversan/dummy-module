import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DummyModule } from '../dummy.module';
import { DummyService } from '../dummy.service';
import { DummyModuleOptions, DummyModuleOptionsFactory } from '../interfaces/dummy.interface';

describe('DummyModule', () => {
  describe('register()', () => {
    it('should provide DummyService with default options', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [DummyModule.register()],
      }).compile();

      const service = module.get<DummyService>(DummyService);
      expect(service).toBeDefined();
    });

    it('should provide DummyService with custom exceptionFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          DummyModule.register({
            exceptionFactory: (err) => new Error(`[${err.code}] ${err.message}`),
          }),
        ],
      }).compile();

      const service = module.get<DummyService>(DummyService);
      expect(service).toBeDefined();
    });
  });

  describe('registerAsync()', () => {
    it('should provide DummyService via useFactory', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          DummyModule.registerAsync({
            useFactory: () => ({
              exceptionFactory: (err) => new Error(err.message),
            }),
          }),
        ],
      }).compile();

      const service = module.get<DummyService>(DummyService);
      expect(service).toBeDefined();
    });

    it('should provide DummyService via useClass', async () => {
      class DummyOptionsFactory implements DummyModuleOptionsFactory {
        createDummyOptions(): DummyModuleOptions {
          return { exceptionFactory: (err) => new Error(err.message) };
        }
      }

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          DummyModule.registerAsync({
            useClass: DummyOptionsFactory,
          }),
        ],
      }).compile();

      const service = module.get<DummyService>(DummyService);
      expect(service).toBeDefined();
    });

    it('should provide DummyService via useExisting', async () => {
      class DummyOptionsFactory implements DummyModuleOptionsFactory {
        createDummyOptions(): DummyModuleOptions {
          return { exceptionFactory: (err) => new Error(err.message) };
        }
      }

      // useExisting requires the provider to exist in an imported module,
      // not directly provided inside the testing module
      @Module({ providers: [DummyOptionsFactory], exports: [DummyOptionsFactory] })
      class FactoryModule {}

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          DummyModule.registerAsync({
            imports: [FactoryModule],
            useExisting: DummyOptionsFactory,
          }),
        ],
      }).compile();

      const service = module.get<DummyService>(DummyService);
      expect(service).toBeDefined();
    });

    it('should throw if neither useFactory, useClass, nor useExisting is provided', () => {
      expect(() => DummyModule.registerAsync({})).toThrow(
        'DummyModule.registerAsync() requires useFactory, useClass, or useExisting.',
      );
    });
  });
});
