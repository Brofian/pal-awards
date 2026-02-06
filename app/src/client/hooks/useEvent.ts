import type SimpleEventTarget from "@/shared/events/SimpleEventTarget.ts";
import type { SimpleEventsList } from "@/shared/events/SimpleEventTarget.ts";
import {useEffect, useState} from "react";
import type {CustomEventInit} from "bun";

export default function useEvent<
    T extends SimpleEventsList,
    E extends keyof T
>(
    eventTarget: SimpleEventTarget<T>,
    event: E,
    defaultValue?: T[E]
): T[E] | undefined {
    const [value, setValue] = useState<T[E] | undefined>(defaultValue);

    useEffect(() => {
        const handler = (evt: CustomEventInit<T[E]>): void => {
            setValue(evt.detail);
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