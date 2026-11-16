import type { StandardSchemaV1 } from "./schema.d.ts";

declare module "@outwalk/firefly" {

    export interface Route { method: string, middleware: Function[], route: string, handler: Function }
    export interface Options { platform?: Platform }

    export type Decorator = (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;

    export abstract class Platform {

        protected abstract loadController(route: string, middleware: Function[], routes: Route[]): void;
        protected abstract loadErrorHandler(): void;
        protected abstract listen(port: number): void;
    }

    export function Application(): Decorator;
    export function Init(): Decorator;

    export function Controller(route?: string): Decorator;
    export function Http(method: string, route?: string): Decorator;
    export function Head(route?: string): Decorator;
    export function Get(route?: string): Decorator;
    export function Post(route?: string): Decorator;
    export function Put(route?: string): Decorator;
    export function Patch(route?: string): Decorator;
    export function Delete(route?: string): Decorator;

    export function Middleware(...middleware: Function[]): Decorator;
    export function Validate(schema: StandardSchemaV1, property?: string): Decorator;

    export function Injectable(): Decorator;
    export function Inject(injectable?: string | { new(): any }): Decorator;

    export function resolveInjectable<T extends new (...args: any[]) => any>(injectable: T): InstanceType<T>;
}