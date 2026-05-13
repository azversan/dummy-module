# Azversan NestJS Module Boilerplate

- [Azversan NestJS Module Boilerplate](#azversan-nestjs-module-boilerplate)
  - [Features](#features)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
    - [Register Module (Synchronous)](#register-module-synchronous)
    - [Register Module (Asynchronous)](#register-module-asynchronous)
  - [Using the Service](#using-the-service)
  - [Exception Factory](#exception-factory)
    - [Default Behavior](#default-behavior)
    - [Custom Exception Example](#custom-exception-example)
  - [API Reference](#api-reference)
    - [`DummyModule.register(options?)`](#dummymoduleregisteroptions)
      - [Options](#options)
    - [`DummyModule.registerAsync(options)`](#dummymoduleregisterasyncoptions)
      - [Async Options](#async-options)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [Testing](#testing)
  - [License](#license)

A production-ready boilerplate for building scalable and reusable NestJS modules with TypeScript.

Designed for creating publishable NestJS packages with:

- Dynamic module support
- Sync & async configuration
- Custom exception factory pattern
- Typed interfaces
- Jest testing
- ESLint + Prettier

## Features

- ✅️ NestJS Dynamic Module pattern
- ✅️ `register()` and `registerAsync()` support
- ✅️ Fully typed configuration interfaces
- ✅️ Custom exception factory support
- ✅️ Unit testing with Jest
- ✅️ ESLint v9 flat config
- ✅️ Prettier formatting
- ✅️ Ready for open-source package distribution

## Installation

```bash
npm install @azversan/dummy
```

Required peer dependencies:

```bash
npm install @nestjs/common @nestjs/core reflect-metadata rxjs
```

## Quick Start

### Register Module (Synchronous)

```ts
import { Module } from '@nestjs/common';
import { DummyModule } from '@azversan/dummy';

@Module({
  imports: [
    DummyModule.register({
      exceptionFactory: (err) => new Error(`[${err.code}] ${err.message}`),
    }),
  ],
})
export class AppModule {}
```

### Register Module (Asynchronous)

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DummyModule } from '@azversan/dummy';

@Module({
  imports: [
    ConfigModule.forRoot(),

    DummyModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        exceptionFactory: (err) => new Error(err.message),
      }),
    }),
  ],
})
export class AppModule {}
```

## Using the Service

```ts
import { Injectable } from '@nestjs/common';
import { DummyService } from '@azversan/dummy';

@Injectable()
export class AppService {
  constructor(private readonly dummyService: DummyService) {}

  hello(): string {
    return this.dummyService.greet('World');
  }
}
```

## Exception Factory

The module supports a customizable exception factory.

### Default Behavior

If no factory is provided, the module throws:

```ts
HttpException(message, 500);
```

### Custom Exception Example

```ts
DummyModule.register({
  exceptionFactory: (error) => {
    return new Error(`[${error.code}] ${error.message}`);
  },
});
```

## API Reference

### `DummyModule.register(options?)`

Register the module synchronously.

#### Options

| Property           | Type               | Description              |
| ------------------ | ------------------ | ------------------------ |
| `exceptionFactory` | `(error) => Error` | Custom exception creator |

### `DummyModule.registerAsync(options)`

Register the module asynchronously.

#### Async Options

| Property      | Description         |
| ------------- | ------------------- |
| `imports`     | Imported modules    |
| `inject`      | Providers to inject |
| `useFactory`  | Factory function    |
| `useClass`    | Class-based factory |
| `useExisting` | Existing provider   |

## Scripts

```bash
# Build package
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run ESLint
npm run lint

# Format code
npm run format
```

## Project Structure

```text
src/
├── dummy/
│   ├── interfaces/
│   ├── __tests__/
│   ├── dummy.constants.ts
│   ├── dummy.module.ts
│   └── dummy.service.ts
└── index.ts
```

## Testing

This project uses:

- Jest
- ts-jest
- @nestjs/testing

Run all tests:

```bash
npm run test
```

Run coverage:

```bash
npm run test:cov
```

## License

[MIT License](LICENSE)
