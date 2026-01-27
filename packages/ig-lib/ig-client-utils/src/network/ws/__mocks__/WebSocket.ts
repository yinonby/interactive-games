
export class WebSocketMock {
  public readonly CLOSED = 1;
  public readonly CLOSING = 2;
  public readonly CONNECTING = 3;
  public readonly OPEN = 4;
  public readyState = this.OPEN;

  constructor(public url: string) {
    setTimeout(() => this.onopen?.(), 0);
  }

  public onopen?: () => void;
  public onmessage?: (event: { data: string }) => void;
  public onclose?: () => void;
  public onerror?: (err: unknown) => void;

  public send = vi.fn();

  public close = vi.fn(() => {
    this.readyState = this.CLOSED;
    this.onclose?.();
  });
}
