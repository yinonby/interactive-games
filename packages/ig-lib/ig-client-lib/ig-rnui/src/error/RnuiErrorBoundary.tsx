
import React, { type PropsWithChildren, type ReactNode } from 'react';
import type { TestableComponentT } from '../types/ComponentTypes';

export type RnuiErrorBoundaryPropsT = TestableComponentT & {
  renderErrorNode: (error: Error) => ReactNode,
  onError?: (error: Error) => void,
}

export class RnuiErrorBoundary extends React.Component<PropsWithChildren<RnuiErrorBoundaryPropsT>, {
  error: Error | null,
}> {
  constructor(props: RnuiErrorBoundaryPropsT) {
    super(props);
    this.state = { error: null};
  }

  static getDerivedStateFromError(error: unknown) {
    // no access to state here, must simply return updated state, so the next render shows the fallback UI
    return { error: error };
  }

  componentDidCatch(error: Error) {
    // has access to state, can print logs, send analytics etc.
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.error) {
      return this.props.renderErrorNode(this.state.error);
    }

    return this.props.children;
  }
}
