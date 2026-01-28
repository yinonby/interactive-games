
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
        route: '',
        expressPlugin: {
          // eslint-disable-next-line @typescript-eslint/require-await
          initRouter: async () => Router(),
        },
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
        getDbAdapterCb: getDbAdapterCbMock,
        route: '',
        expressPlugin: {
          // eslint-disable-next-line @typescript-eslint/require-await
          initRouter: async () => Router(),
        },
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(getDbAdapterCbMock).toHaveBeenCalled();
    expect(createTablesMock).toHaveBeenCalledWith(true, '');
  });

  it('should init routes, without db adapter', async () => {
    const initRouterMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        route: '',
        expressPlugin: {
          initRouter: initRouterMock,
        },
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(initRouterMock).toHaveBeenCalledWith(mockStarterInfo.appInfo, null);
  });

  it('should init routes, with db adapter', async () => {
    const getDbAdapterCbMock = vi.fn();
    getDbAdapterCbMock.mockReturnValue('MOCKDBADAPTER');

    const initRouterMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        getDbAdapterCb: getDbAdapterCbMock,
        route: '',
        expressPlugin: {
          initRouter: initRouterMock,
        },
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(getDbAdapterCbMock).toHaveBeenCalled();
    expect(initRouterMock).toHaveBeenCalledWith(mockStarterInfo.appInfo, 'MOCKDBADAPTER');
  });

  it('should call post init callback, without db adapter', async () => {
    const postInitMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        route: '',
        expressPlugin: {
          initRouter: vi.fn(),
        },
        postInitCb: postInitMock,
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(postInitMock).toHaveBeenCalledWith(null);
  });

  it('should call post init callback, with db adapter', async () => {
    const getDbAdapterCbMock = vi.fn();
    getDbAdapterCbMock.mockReturnValue('MOCKDBADAPTER');

    const postInitMock = vi.fn();

    const mockStarterInfo: ExpressAppStarterInfoT = {
      listerPort: 1287,
      appInfo: { appVersion: '1.1' },
      expressPluginContainers: [{
        getDbAdapterCb: getDbAdapterCbMock,
        route: '',
        expressPlugin: {
          initRouter: vi.fn(),
        },
        postInitCb: postInitMock,
      }],
    };
    const expressApp: ExpressApp = new ExpressApp(mockStarterInfo, mockLogger);
    await expressApp.startApp();

    expect(getDbAdapterCbMock).toHaveBeenCalled();
    expect(postInitMock).toHaveBeenCalledWith('MOCKDBADAPTER');
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