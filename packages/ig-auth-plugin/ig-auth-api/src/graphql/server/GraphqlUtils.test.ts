
import type { SignupPluginAdapter } from '@ig/auth-be-models';
import type { Request, Response } from 'express';
import { buildContext } from './GraphqlUtils';

describe('buildContext', () => {
  const mockReq = {} as Request;
  const mockRes = {} as Response;

  it('should return context when reqAuthId exists', async () => {
    const signupPluginAdapter = {
      extractRequestAuthId: vi.fn().mockReturnValue('USER1'),
    } as unknown as SignupPluginAdapter;

    const ctx = await buildContext(mockReq, mockRes, signupPluginAdapter);

    expect(ctx).toEqual({ req: mockReq, res: mockRes, reqAuthId: 'USER1' });
    expect(signupPluginAdapter.extractRequestAuthId).toHaveBeenCalledWith(mockReq);
  });
});