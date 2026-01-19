
import '@testing-library/jest-native/extend-expect';
// figure out why cannot export these from @ig/rn-testing
import { initReactNativeMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/ReactNativeMocks';
import { initRnuiMocks } from '../../../ig-dev-lib/ig-rn-testing/src/mocks/RnuiMocks';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

jest.mock('../src/app/providers/useClientLogger'); // uses __mocks__

initReactNativeMocks();
initRnuiMocks();
