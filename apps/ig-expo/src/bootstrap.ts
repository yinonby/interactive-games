
import { ignoreLogs } from './utils/LogUtils';

// silence errors
ignoreLogs([
  '"shadow*" style props are deprecated',
]);
