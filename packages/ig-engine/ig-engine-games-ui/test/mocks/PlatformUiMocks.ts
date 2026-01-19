
export const initPlatformUiMocks = () => {
  jest.mock("@ig/platform-ui", () => {
    const navigateMock = jest.fn();
    const navigateReplaceMock = jest.fn();

    return {
      __esModule: true,
      usePlatformUiNavigation: () => ({
        navigate: navigateMock,
        navigateReplace: navigateReplaceMock,
      }),
      // expose for tests
      __puiMocks: {
        navigateMock,
        navigateReplaceMock,
      },
    };
  });
}
