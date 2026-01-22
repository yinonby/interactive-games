
export const initPlatformUiMocks = () => {
  jest.mock('@ig/platform-ui', () => {
    const navigateMock = jest.fn();
    const navigateReplaceMock = jest.fn();
    const getItemMock = jest.fn();
    const setItemMock = jest.fn();

    return {
      __esModule: true,
      usePlatformUiNavigation: () => ({
        navigate: navigateMock,
        navigateReplace: navigateReplaceMock,
      }),
      useStorage: () => ({
        getItem: getItemMock,
        setItem: setItemMock,
      }),

      // expose for tests
      __puiMocks: {
        navigateMock,
        navigateReplaceMock,
        getItemMock,
        setItemMock,
      },
    };
  });
}
