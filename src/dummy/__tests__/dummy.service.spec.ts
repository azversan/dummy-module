import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DUMMY_MODULE_OPTIONS } from '../dummy.constants';
import { DummyService } from '../dummy.service';

describe('DummyService', () => {
  let service: DummyService;

  describe('with default options (no exceptionFactory)', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DummyService,
          { provide: DUMMY_MODULE_OPTIONS, useValue: {} },
        ],
      }).compile();

      service = module.get<DummyService>(DummyService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('greet() should return a greeting string', () => {
      expect(service.greet('World')).toBe('Hello, World!');
    });

    it('throwError() should throw HttpException by default', () => {
      expect(() =>
        service.throwError({ code: 'TEST_ERROR', message: 'Test error message' }),
      ).toThrow(HttpException);
    });
  });

  describe('with custom exceptionFactory', () => {
    class CustomError extends Error {
      constructor(public code: string, message: string) {
        super(message);
      }
    }

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DummyService,
          {
            provide: DUMMY_MODULE_OPTIONS,
            useValue: {
              exceptionFactory: (err: { code: string; message: string }) =>
                new CustomError(err.code, err.message),
            },
          },
        ],
      }).compile();

      service = module.get<DummyService>(DummyService);
    });

    it('throwError() should use the custom exceptionFactory', () => {
      expect(() =>
        service.throwError({ code: 'CUSTOM_ERROR', message: 'Custom error' }),
      ).toThrow(CustomError);
    });
  });
});
