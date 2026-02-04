
export const TOTAL_GRID_COLUMNS = 12;

export const smWidth = 480;
export const mdWidth = 768;
export const lgWidth = 1024;
export const xlWidth = 1280;

export const getBreakpoint = (width: number) => {
  if (width >= xlWidth) return "xl";
  if (width >= lgWidth) return "lg";
  if (width >= mdWidth) return "md";
  if (width >= smWidth) return "sm";
  return "xs";
};
