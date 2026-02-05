
import { isAndroid, isWeb } from './RnuiUtils';

// Mock react-native Platform module
jest.mock("react-native", () => ({
  Platform: {
    OS: "web", // default value; we can override in tests
  },
}));

import { Platform } from 'react-native';

type PlatformT = { OS: "web" | "ios" | "android" };

describe("RnuiUtils", () => {
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

  describe("isAndroid", () => {
    it("returns true when Platform.OS is 'android'", () => {
      (Platform as PlatformT).OS = "android";
      expect(isAndroid()).toBe(true);
    });

    it("returns false when Platform.OS is not 'android'", () => {
      (Platform as PlatformT).OS = "ios";
      expect(isAndroid()).toBe(false);

      (Platform as PlatformT).OS = "web";
      expect(isAndroid()).toBe(false);
    });
  });
});
