declare module "@outwalk/firefly/events" {
    import type { Decorator } from "@outwalk/firefly";
    
    export class EventEmitter {

        private events: Record<string, Function[]>;

        emit(event: string, payload?: any): Promise<void>;
        on(event: string, callback: Function): void;
    }

    export function Event(event: string): Decorator;
}