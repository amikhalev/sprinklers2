declare module sse {

  enum ReadyState {CONNECTING = 0, OPEN = 1, CLOSED = 2}

  class IEventSourceStatic extends EventTarget {
    constructor(url:string, eventSourceInitDict?:IEventSourceInit);

    url:string;
    withCredentials:boolean;
    CONNECTING:ReadyState; // constant, always 0
    OPEN:ReadyState; // constant, always 1
    CLOSED:ReadyState; // constant, always 2
    readyState:ReadyState;
    onopen:Function;
    onmessage:(event:IOnMessageEvent) => void;
    onerror:Function;
    close:() => void;
  }

  interface IEventSourceInit {
    withCredentials?: boolean;
  }

  interface IOnMessageEvent {
    data: string;
  }
}

declare class EventSource extends sse.IEventSourceStatic {
}
