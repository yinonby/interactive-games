
import { isWeb } from './PlatformUtils';

// Mock react-native Platform module
jest.mock("react-native", () => ({
  Platform: {
    OS: "web", // default value; we can override in tests
  },
}));

import { Platform } from 'react-native';

type PlatformT = { OS: "web" | "ios" | "android" };

describe("isWeb", () => {
  it("returns true when Platform.OS is 'web'", () => {
    (Platform as PlatformT).OS = "web";
    expect(isWeb()).toBe(true);
  });

  it("returns false when Platform.OS is not 'web'", () => {
    (Platform as PlatformT).OS = "ios";
    expect(isWeb()).toBe(false);

    (Platform as PlatformT).OS = "android";
    expect(isWeb()).toBe(false);
  });
});
