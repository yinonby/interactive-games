
export const initAuthUiMocks = () => {
  jest.mock('@ig/auth-ui', () => {
    const actual = jest.requireActual<typeof import('@ig/app-engine-ui')>(
      '@ig/app-engine-ui'
    );
    const useAuthMock = jest.fn();

    return {
      ...actual,
      useAuth: useAuthMock,

      // expose for tests
      __authUiMocks: {
        useAuthMock,
      },
    };
  });
}
