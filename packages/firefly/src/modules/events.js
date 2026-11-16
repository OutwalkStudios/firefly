/* An Event Emitter class designed to emit events for an event driven architecture */
export class EventEmitter {

    /* apply the properties to make the EventEmitter class injectable */
    static _injectable = true;

    events = {};

    async emit(event, payload) {
        if (!this.events[event]) return;
        await Promise.all(this.events[event].map((callback) => callback(payload)));
    }

    on(event, handler) {
        this.events[event] = this.events[event] ?? [];
        this.events[event].push(handler);
    }
}

/* a decorator to mark a method as an event */
export function Event(event) {
    return (target, key) => {
        target._events = target._events ?? [];
        target._events.push({ name: event, handler: target[key] });
    };
}