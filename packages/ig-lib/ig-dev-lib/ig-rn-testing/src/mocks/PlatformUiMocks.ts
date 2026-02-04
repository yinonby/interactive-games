
export const initPlatformUiMocks = () => {
  jest.mock('@ig/platform-ui', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { View } = require('react-native');

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
      PlatformUiLink: View,

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
