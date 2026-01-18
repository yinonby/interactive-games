
export const RNUI_SNACKBAR_DEFAULT_DURATION_MS = 5000;

export type RnuiSnackbarMessageRequestT = {
  message: string,
  level?: "info" | "warn" | "err",
  durationMs?: number,
  withCloseButton?: boolean,
}

export type RnuiSnackbarMessageInfoT = RnuiSnackbarMessageRequestT & {
  uniqueKey: string,
  durationMs: number,
  withCloseButton: boolean,
  displayStartTs: number,
  level: "info" | "warn" | "err",
}
