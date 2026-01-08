
import { useRouter } from 'expo-router';

export type PlatformUiNavigationT = {
  navigate: (url: string) => void,
  navigateReplace: (url: string) => void,
};

export const usePlatformUiNavigation = (): PlatformUiNavigationT => {
  const router = useRouter();
  return {
    navigate: (url: string) => router.navigate(url),
    navigateReplace: (url: string) => router.replace(url)
  };
}
