
export type AppRtkQueryReturnValue<T = unknown, E = unknown> = {
    error: E;
    data?: undefined;
} | {
    error?: undefined;
    data: T;
};
