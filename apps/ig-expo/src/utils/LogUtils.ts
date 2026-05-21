
import { LogBox } from 'react-native';

export function ignoreLogs(ignoreLogTextList: string[]): void {
  LogBox.ignoreLogs(ignoreLogTextList);

  if (__DEV__) {
    const connectConsoleTextFromArgs = (args: any[]): string => {
      const arrayOfStrings: string[] = args.filter(e => typeof e === "string");

      if (arrayOfStrings.length === 0) {
        return "";
      }

      return arrayOfStrings
        .slice(1)
        .reduce(
          (baseString, currentString) => baseString.replace("%s", currentString),
          arrayOfStrings[0],
        );
    }

    const filterIgnoredMessages =
      (logger: (message?: any, ...optionalParams: any[]) => void): ((...args: any[]) => void) =>
        (...args): void => {
          const logText = connectConsoleTextFromArgs(args);

          if (!ignoreLogTextList.some((ignoredLogText) => logText.includes(ignoredLogText))) {
            logger(...args);
          }
        };

    console.log = filterIgnoredMessages(console.log);
    console.info = filterIgnoredMessages(console.info);
    console.warn = filterIgnoredMessages(console.warn);
    console.error = filterIgnoredMessages(console.error);
  }
}
