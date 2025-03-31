class ScheduledCallbackItem  {
  callback: ScheduledCallbackFunction;
  state: ScheduledState;
  timeout?: number;
  finishCallback?: ScheduledCallbackFunction;
  control: any;

  constructor(callback: ScheduledCallbackFunction, state: ScheduledState, timeout?: number, finishCallback?: ScheduledCallbackFunction) {
    this.callback = callback;
    this.state = state;
    this.timeout = timeout;
    this.finishCallback = finishCallback;
  }
}
