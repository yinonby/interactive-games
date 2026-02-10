
import type { LoggerAdapter } from '@ig/utils';
import express from 'express';
import { MongoInmemDbServer } from '../db/MongoInmemDbServer';
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
      expressPluginContainers: [],
    };
    new ExpressApp(mockStarterInfo);
  });

  it('should use json middleware', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(useMock).toHaveBeenNthCalledWith(1, 'JSONFNMOCK'); // express.json()
  });

  it('should initialize with CORS', async () => {
    const corsMiddlewareMock = vi.fn().mockReturnValue('CORSRES');
    const signalHandler: { on: (signal: string, fn: (signal: string) => void) => void } = {
      on: vi.fn(),
    }
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [],
      corsAllowOrigins: ['origin1']
    };

    const expressApp = new ExpressApp(mockStarterInfo, mockLogger, signalHandler, corsMiddlewareMock);
    await expressApp.startApp();

    expect(corsMiddlewareMock).toHaveBeenCalledWith({ origin: 'origin1', credentials: true });
    expect(useMock).toHaveBeenCalledWith('CORSRES');
  });

  it('should init db, without db adapter', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: 'mongodb://localhost', tableNamePrefix: '' },
      expressPluginContainers: [{
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();
  });

  it('should init db, with db adapter', async () => {
    const getDbAdapterCbMock = vi.fn();
    const createTablesMock = vi.fn();
    getDbAdapterCbMock.mockReturnValue({ createTables: createTablesMock });

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: 'mongodb://localhost', tableNamePrefix: '' },
      expressPluginContainers: [{
        getPackageDb: getDbAdapterCbMock,
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(getDbAdapterCbMock).toHaveBeenCalled();
    expect(createTablesMock).toHaveBeenCalledWith(true, '');
  });

  it('should not init routes when no route config is given', async () => {
    const initRouterMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(initRouterMock).not.toHaveBeenCalled();
  });

  it('should init routes when route config is given', async () => {
    const initRouterMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        routeConfig: {
          route: '/',
          expressPlugin: {
            initRouter: initRouterMock,
          },
          pluginConfig: 5,
        }
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(initRouterMock).toHaveBeenCalled();
  });

  it('should call post init callback, with plugin config', async () => {
    const initRouterMock = vi.fn();
    const postInitMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        routeConfig: {
          route: '/',
          expressPlugin: {
            initRouter: initRouterMock,
          },
          pluginConfig: 5,
        },
        postInitCb: postInitMock,
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(postInitMock).toHaveBeenCalledWith(mockStarterInfo.expressPluginContainers[0].routeConfig?.pluginConfig);
  });

  it('should call post init callback, without plugin config', async () => {
    const postInitMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        postInitCb: postInitMock,
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(postInitMock).toHaveBeenCalledWith(undefined);
  });

  it('should listen on given port', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(listenMock).toHaveBeenCalledWith(1287, expect.any(Function));

    const listenCb = listenMock.mock.calls[0][1];
    vi.clearAllMocks();

    listenCb();
    expect(mockLogger.log).toHaveBeenCalledWith(`Server is running at http://localhost:${1287}`);
  });

  it('should handle shutdown', async () => {
    // start a local mongo inmem server
    const mongoInmemDbServer = new MongoInmemDbServer();
    const uri = await mongoInmemDbServer.startDb();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 3000,
      appInfo: { appVersion: '1.1' },
      dbInfo: { dbType: 'mongodb', mongoConnString: uri, tableNamePrefix: '' },
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

  it('should handle shutdown, without db instance', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 3000,
      appInfo: { appVersion: '1.1' },
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