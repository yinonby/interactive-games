
import type { AppTranslationKeyT } from "@/types/CommonTranslationTypes";
import type { AppLocalizationContextT } from "../AppLocalizationProvider";

export const useAppLocalization = (): AppLocalizationContextT => ({
  t: jest.fn((tKey: AppTranslationKeyT) => buildMockedTranslation(tKey)),
})

export const buildMockedTranslation = (tKey: AppTranslationKeyT) => "mocked-t-" + tKey;