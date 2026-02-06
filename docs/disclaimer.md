## Disclaimer
This project is based on some technical decisions, that have their downsides just like everything.
Although for a small project like this the usability is the main concern, it is always a good idea to

### Know about the weaknesses:
- TypeScript - even though we use a somewhat strict TypeScript setup, JavaScript is notoriously quirky and single threaded
- Bun - still has some compatability issues with NodeJS packages 
- ReactJS - produces a great overhead on clientside JavaScript code and heavily makes use of the memory
- DuckDB - focuses more on high performance single-query applications with column based calculations and analytic optimizations, not optimal for a general purpose server side database
- Docker - creates an additional layer between the application and the host machine

### Why are we using these after all of that? Of course there are some benefits as well:
- TypeScript - when used correctly, the TypeScript language offers a very strong type system whilst maintaining the flexibility of JavaScript
- Bun - Modern, faster and slightly more lightweight alternative to NodeJS. Also has built-in TypeScript or JSX functionality without additional packages 
- ReactJS - simplifies hierarchical structures, component-based applications and automated but controlled DOM updates with HTML-in-JS via JSX
- DuckDB - it shines with a very good documentation and debugging features for query optimization
- Docker - allows to simply run the development instances on every environment, independent of operating system or local installations 

### What would be some alternatives for a real-life-sized project?
- NodeJS - While staying at TypeScript, there are more runtimes like classic NodeJS or Deno. But other languages could implement the server side code more efficiently and even on
more threads. One example could be GoLang or classic PHP for Request-Response behavior
- ReactJS - Could be replaced by traditional html/js/css (maybe the new default CustomComponents?) or other frameworks
- Docker is already very performant, but could easily be replaced by VM's, other Container-Systems or even skipped entirely on the production server

## General hints
- Try to keep database queries small. The last thing we want with a single-thread process is to handle a gigantic dataset. Also,
I was to lazy to further think about chunking query results via generators to keep the code complexity lower... (I hope nobody reads this)