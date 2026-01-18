
export const RNUI_SNACKBAR_DEFAULT_DURATION_MS = 5000;

export type RnuiSnackbarMessageRequestT = {
  message: string,
  durationMs?: number,
  withCloseButton?: boolean,
  level?: "info" | "warn" | "err",
}

export type RnuiSnackbarMessageInfoT = RnuiSnackbarMessageRequestT & {
  uniqueKey: string,
  durationMs: number,
  withCloseButton: boolean,
  displayStartTs: number,
  level: "info" | "warn" | "err",
}
