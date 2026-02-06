# Best practices
This is a not exhaustive list of best practices for working on this project.
Please try to stick to them as close as possible (if not already enforced by TypeScript or linter config).


1. Use the file-extension `.tsx` only for ReactComponents and `.ts` for other files
2. Create new React components in their own file. If you want to add some custom CSS outside of tailwind, name the CSS file the same as the component next to it:
   ```
   MyComponent.tsx:
   
   export default function MyComponent({props: ...}) {
        return <div className="my-component"></div>
   }
   
   MyComponent.css:
   
   .my-component {
        ...
   }
   ```
3. If you notice to many tailwind classes in one element, move them to a CSS file as described above, then use plain CSS or at least `@apply tailwind-classes`
4. Only use the `shared` directory for pure types, functions and constants that are meant to be visible in both the client and the server. This is enforced by the linter
5. Do not use the TOP-Type `Any`. Stick to `unknown`, `never` or a concrete type instead
6. Prefer function components over class components. These reduce the memory overhead and adhere to more modern react coding standards
7. Use classes for data and any functionality, that would benefit from encapsulation and access restriction
8. Try to avoid race conditions of any type
9. For consistency: keep directories and entry-ts files in lowercase and components and class-files in uppercase files
10. Always prefer `===` and `!==` over `==` and `!=`, otherwise rethink your life choices and why you would want any form of automatic type conversion in a comparison
11. Use variable names that are expressive enough to their scope (larger scope generally means they need to be more specific)
12. Write and comment functions to keep things clean
13. Keep implementation and quirks inside a function. Whoever calls it should not be concerned with how the function achieves the result. If that is not possible (timings, etc.) explicitly state that in the function JSDoc