
import { useRouter } from 'expo-router';

export type PlatformUiNavigationT = {
  navigate: (url: string) => void,
  navigateReplace: (url: string) => void,
};

export const usePlatformUiNavigation = (): PlatformUiNavigationT => {
  const router = useRouter();
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate: (url: string) => router.navigate(url as any),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigateReplace: (url: string) => router.replace(url as any)
  };
}
