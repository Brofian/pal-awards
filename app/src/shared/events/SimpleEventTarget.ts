import type {CustomEventInit} from "bun";

export type SimpleEventListener<D> = { (event: CustomEventInit<D>): void };

export type SimpleEventsList = { [key: string]: unknown };

export default class SimpleEventTarget<Events extends SimpleEventsList> extends EventTarget {
    /**
     * Define an unused pseudo-property for allowing TypeScript to infer this generic type later on
     * @protected
     * @internal
     * @ignore
     */
    protected declare __events: Events;


    public on<K extends keyof Events>(event: K, listener: SimpleEventListener<Events[K]>): void {
        super.addEventListener("custom:" + String(event), listener);
    }

    public off<K extends keyof Events>(event: K, listener: SimpleEventListener<Events[K]>): void {
        super.removeEventListener("custom:" + String(event), listener);
    }

    public dispatch<K extends keyof Events>(event: K, data: Events[K]): void {
        super.dispatchEvent(
            new CustomEvent('custom:' + String(event), {
                detail: data
            }),
        );
    }

    /* =========================================================================== *
     * Disable the original methods, so they can only be called via the super call *
     * =========================================================================== */

    /**
     * @deprecated Use the dispatch method instead
     */
    public override dispatchEvent(_event: never): never {
        throw Error("Do not use dispatchEvent on SimpleEventTarget. Use dispatch(...) instead ");
    }

    /**
     * @deprecated Use the on method instead
     */
    public override addEventListener(_type: never, _callback: never, _options?: never): never {
        throw Error("Do not use addEventListener on SimpleEventTarget. Use on(...) instead ");
    }

    /**
     * @deprecated Use the off method instead
     */
    public override removeEventListener(_type: never, _callback: never, _options?: never): never {
        throw Error("Do not use removeEventListener on SimpleEventTarget. Use off(...) instead ");
    }

}