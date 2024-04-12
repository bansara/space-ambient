export class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  // Register an event listener
  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Remove an event listener
  off(event: string, listenerToRemove: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      (listener) => listener !== listenerToRemove
    );
  }

  // Emit an event to all registered listeners
  emit(event: string, data?: any) {
    const listeners = this.events[event];
    if (listeners && listeners.length) {
      listeners.forEach((listener) => listener(data));
    }
  }
}
