import type SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type { SimpleEventsList } from "@/shared/events/SimpleEventTarget.ts";
import {useEffect, useState} from "react";
import type {CustomEventInit} from "bun";

export default function useEvent<
    T extends SimpleEventsList,
    E extends keyof T
>(  // Additional overload to add the possible undefined return type if a default is omitted. This comment cannot be a JSDoc
    eventTarget: SimpleEventTarget<T>,
    event: E,
    defaultValue?: undefined,
    callback?: {(value: T[E]): void}
): T[E] | undefined;

export default function useEvent<
    T extends SimpleEventsList,
    E extends keyof T
>(  // Additional overload to the useEvent hook that ensures the return type if a default is set. This comment cannot be a JSDoc
    eventTarget: SimpleEventTarget<T>,
    event: E,
    defaultValue: T[E],
    callback?: {(value: T[E]): void}
): T[E];

/**
 * Subscribe to an event on the provided EventTarget, then get updated automatically with the last
 * data this event was dispatched with
 *
 * @param eventTarget       The instance on which the event is expected to be dispatched.
 * @param event             The event to listen to.
 * @param defaultValue      An optional default value until the event is dispatched the first time.
 * @param callback          An optional callback that is executed when the event is triggered, before the value is updated
 */
export default function useEvent<
    T extends SimpleEventsList,
    E extends keyof T
>(
    eventTarget: SimpleEventTarget<T>,
    event: E,
    defaultValue?: T[E],
    callback?: {(value: T[E]): void}
): T[E] | undefined {
    const [value, setValue] = useState<T[E] | undefined>(defaultValue);

    useEffect(() => {
        const handler = (evt: CustomEventInit<T[E]>): void => {
            if (evt.detail) {
                if (callback) {
                    callback(evt.detail);
                }

                setValue(evt.detail);
            }
        };
        // subscribe to the event
        eventTarget.on(event, handler);

        return () => {
            // unsubscribe to the event on cleanup
            eventTarget.off(event, handler);
        };
    }, [eventTarget, event, value]);

    return value;
}