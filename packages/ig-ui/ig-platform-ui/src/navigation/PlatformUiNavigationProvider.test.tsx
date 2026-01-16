
import { render } from '@testing-library/react-native';
import type { Router } from "expo-router";
import * as ExpoRouter from 'expo-router';
import { usePlatformUiNavigation, type PlatformUiNavigationT } from "./PlatformUiNavigationProvider";

describe('RnuiProvider', () => {
  const useRouterSpy = jest.spyOn(ExpoRouter, "useRouter");
  const navigateMock = jest.fn();
  const replaceMock = jest.fn();
  beforeAll(() => {
    useRouterSpy.mockReturnValue({
      navigate: navigateMock,
      replace: replaceMock,
    } as unknown as Router);
  })

  it('usePlatformUiNavigation returns the exact config object', () => {
    let contextValue: PlatformUiNavigationT | undefined;

    const TestConsumer: React.FC = () => {
      contextValue = usePlatformUiNavigation();
      return null;
    };

    render(<TestConsumer />);

    expect(contextValue).toBeTruthy();

    contextValue?.navigate("");
    expect(navigateMock).toHaveBeenCalled();

    contextValue?.navigateReplace("");
    expect(replaceMock).toHaveBeenCalled();
  });
});
