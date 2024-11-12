/* An Event Emitter class designed to emit events for an event driven architecture */
export class EventEmitter {

    static events = {};

    static emit(event, payload) {
        if (!EventEmitter.events[event]) return;
        EventEmitter.events[event].forEach((callback) => callback(payload));
    }

    static on(event, handler) {
        EventEmitter.events[event] = EventEmitter.events[event] ?? [];
        EventEmitter.events[event].push(handler);
    }
}

/* register an event listener for the EventEmitter class */
export function Event(event) {
    return (target, key) => {
        EventEmitter.on(event, target[key]);
    };
}