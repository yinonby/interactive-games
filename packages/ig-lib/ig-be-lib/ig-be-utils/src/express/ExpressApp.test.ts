
import type { LoggerAdapter } from '@ig/utils';
import express from 'express';
import { MongoInmemDbServer } from '../db/MongoInmemDbServer';
import type { ExpressAppStarterInfoT } from '../types/exported/ExpressTypes';
import { ExpressApp, type ExpressAppSignalHandler } from './ExpressApp';

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
    const signalHandler: ExpressAppSignalHandler = {
      on: vi.fn(),
      exit: vi.fn(),
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

  it('should handle shutdown, SIGINT', async () => {
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
    const exitMock = vi.fn();
    const signalHandler: ExpressAppSignalHandler = {
      on: onMock,
      exit: exitMock,
    }

    const app = new ExpressApp(mockStarterInfo, mockLogger, signalHandler);
    await app.startApp();

    const sigint = 'SIGINT';
    const sigterm = 'SIGTERM';
    expect(onMock.mock.calls[0][0]).toEqual(sigint);
    expect(onMock.mock.calls[1][0]).toEqual(sigterm);

    const shutdownFn = onMock.mock.calls[0][1];

    vi.clearAllMocks(); // clear mockLogger

    // simulate SIGINT
    await shutdownFn(sigint);
    expect(mockLogger.log).toHaveBeenNthCalledWith(1, `Received ${sigint} signal. Disconnecting DB client...`);
    expect(mockLogger.log).toHaveBeenNthCalledWith(2, `Received ${sigint} signal. Closing server...`);
    expect(exitMock).toHaveBeenCalledTimes(1);

    // send another SIGINT - should do nothing
    await shutdownFn(sigint);
    expect(exitMock).toHaveBeenCalledTimes(1);
  });

  it('should handle shutdown, SIGTERM', async () => {
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
    const exitMock = vi.fn();
    const signalHandler: ExpressAppSignalHandler = {
      on: onMock,
      exit: exitMock,
    }

    const app = new ExpressApp(mockStarterInfo, mockLogger, signalHandler);
    await app.startApp();

    const sigterm = 'SIGTERM';
    const shutdownFn = onMock.mock.calls[0][1];

    vi.clearAllMocks(); // clear mockLogger

    // simulate SIGTERM
    await shutdownFn(sigterm);
    expect(mockLogger.log).toHaveBeenNthCalledWith(1, `Received ${sigterm} signal. Disconnecting DB client...`);
    expect(mockLogger.log).toHaveBeenNthCalledWith(2, `Received ${sigterm} signal. Closing server...`);
    expect(exitMock).toHaveBeenCalled();
  });

  it('should handle shutdown, without db instance', async () => {
    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 3000,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [],
    };

    const onMock = vi.fn();
    const exitMock = vi.fn();
    const signalHandler: ExpressAppSignalHandler = {
      on: onMock,
      exit: exitMock,
    }

    const app = new ExpressApp(mockStarterInfo, mockLogger, signalHandler);
    await app.startApp();

    const sigint = 'SIGINT';
    const shutdownFn = onMock.mock.calls[0][1];

    vi.clearAllMocks(); // clear mockLogger

    // simulate SIGINT
    await shutdownFn(sigint);
    expect(mockLogger.log).toHaveBeenNthCalledWith(1, `Received ${sigint} signal. Closing server...`);
    expect(exitMock).toHaveBeenCalled();
  });
});