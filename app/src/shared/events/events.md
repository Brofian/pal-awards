# Event module

This module adds a new SimpleEventTarget class, that allows extended and typed usage of the default
JS class EventTarget. New classes can just extend the SimpleEventTarget and provide their own list of possible events
with their payload.
Everything happens typesafe and IDE supported arguments.

```typescript
export type MyComponentEvents = {
    "loaded": {},
    "clicked": { mouseX: number, mouseY: number },
}


class MyComponent extends SimpleEventTarget<MyComponentEvents> {
    ...
}
```

Now instances of `MyComponent` act as a medium to listen and trigger events onto.

```typescript
class MyComponent extends SimpleEventTarget<MyComponentEvents> {
    onClick(event: MouseEvent): void {
        const {mouseX, mouseY} = event;
        this.dispatch("clicked", {mouseX, mouseY});
    }
}

const myComp = new MyComponent();

myComp.on("clicked", () => {
    console.log("My component was clicked and i heard it!");
});
```

This also works with the `useEvent` hook:

```typescript
const lastEventPayload = useEvent(myComp, 'clicked');
```

(but be careful of object scope! Probably makes the most sense to use with singleton objects)
