export class EventHelper {
  static _events = {};

  // calls specified event
  static callEvent(eventId, options) {
    const callbacks = this._events[eventId];
    if (callbacks) {
      for (let callback of callbacks) {
        callback(options);
      }
    }
  }

  // adds event listener
  static addEventListener(eventId, callback) {
    if (!this._events[eventId]) {
      this._events[eventId] = [callback];
    } else {
      this._events[eventId].push(callback);
    }
  }

  // removes event listener
  static removeEventListener(eventId, callback) {
    const callbacks = this._events[eventId];
    if (callbacks) {
      for (let i = callbacks.length - 1; i >= 0; i--) {
        if (callbacks[i] === callback) {
          this._events[eventId].splice(i, 1);
        }
      }
    }
  }
}
