
import type { LoggerAdapter } from '@ig/lib';
import express, { Router } from 'express';
import type { ExpressAppStarterInfoT } from '../types/exported/ExpressTypes';
import { ExpressApp } from './ExpressApp';

vi.mock('express');
vi.mock('mongoose');
vi.mock('../db/DbInstance', () => {
  return {
    DbInstance: vi.fn().mockImplementation(() => ({
      startDb: vi.fn(),
      stopDb: vi.fn(),
    })),
  };
});

describe('ExpressApp', () => {
  const mockLogger: LoggerAdapter = { log: vi.fn() } as unknown as LoggerAdapter;
  const useMock = vi.fn();
  const listenMock = vi.fn();

  vi.mocked(express).mockReturnValue({
    use: useMock,
    listen: listenMock,
  } as unknown as ReturnType<typeof express>);

  const jsonSpy = vi.spyOn(express, 'json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonSpy.mockReturnValue('JSONFNMOCK' as any);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with defaults', () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: 'mongodb://localhost', tableNamePrefix: '' },
      expressPluginContainers: [],
    };
    new ExpressApp(mockStarterInfo);
  });

  it('should start app and initialize db, routes, and process signals', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: 'mongodb://localhost', tableNamePrefix: '' },
      expressPluginContainers: [],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(mockLogger.log).toHaveBeenNthCalledWith(1, 'Starting server...');
    expect(mockLogger.log).toHaveBeenNthCalledWith(2, 'Initializing db...');
    expect(mockLogger.log).toHaveBeenNthCalledWith(3, 'Initializing routes...');
    expect(useMock).toHaveBeenNthCalledWith(1, 'JSONFNMOCK'); // express.json()
    expect(listenMock).toHaveBeenCalledWith(1287, expect.any(Function));

    listenMock.mock.calls[0][1]();
    expect(mockLogger.log).toHaveBeenNthCalledWith(4, `Server is running at http://localhost:${1287}`);
  });

  it('should init db', async () => {
    const initDbMock = vi.fn();
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: 'mongodb://localhost', tableNamePrefix: '' },
      expressPluginContainers: [{
        route: '',
        expressPlugin: {
          initRouter: () => Router(),
          initDb: initDbMock,
        },
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(initDbMock).toHaveBeenCalledWith(mockStarterInfo.dbInfo);
  });

  it('should handle shutdown', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 3000,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'inmem-mongodb', tableNamePrefix: '' },
      expressPluginContainers: [],
    };

    const onMock = vi.fn();
    const signalHandler: { on: (signal: string, fn: (signal: string) => void) => void } = {
      on: onMock,
    }

    const app = new ExpressApp(mockStarterInfo, mockLogger, signalHandler);
    await app.startApp();

    expect(onMock.mock.calls[0][0]).toEqual('SIGINT');
    expect(onMock.mock.calls[1][0]).toEqual('SIGTERM');

    const shutdownFn = onMock.mock.calls[0][1];

    vi.clearAllMocks();

    // simulate SIGINT
    shutdownFn('SIGINT');
    expect(mockLogger.log).toHaveBeenNthCalledWith(1, `Received ${'SIGINT'} signal. Closing server...`);

    vi.clearAllMocks();

    // simulate SIGINT
    shutdownFn('SIGTERM');
    expect(mockLogger.log).toHaveBeenNthCalledWith(1, `Received ${'SIGTERM'} signal. Closing server...`);
  });
});