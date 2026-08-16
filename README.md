# Love Garden

**Love Garden is a small browser-based digital gift I built for someone I love.**

I didn't have money to buy a traditional gift, so I decided to make one instead.

The result was a little interactive garden where the experience itself is the gift.

## Why I Built It

Sometimes building something is more personal than buying something.

I wanted to create something that could exist specifically for us rather than something that could simply be purchased from a store.

So instead of spending money, I spent time designing and programming a small interactive world.

The project became a way of turning:

```text
Time
  +
Code
  +
Creativity
  ↓
Something personal
```

into a gift.

## The Idea

The application is built around a digital garden rendered in the browser.

The interface provides controls for interacting with the garden, while the canvas acts as the visual environment.

The basic structure is:

```text
Browser
  │
  ├── Interface
  │
  └── Canvas
        │
        └── Interactive Garden
```

The UI handles configuration and interaction.

The canvas provides the actual visual world.

## Technology

The project is intentionally simple.

It uses:

* HTML
* CSS
* JavaScript
* HTML Canvas
* Browser Local Storage

There is no backend.

There is no database server.

There is no framework.

The entire experience runs locally in the browser.

## Architecture

The HTML provides the basic application shell.

The interface is mounted into:

```text
#ui-root
```

while the visual garden is rendered onto:

```text
#treeCanvas
```

The JavaScript engine is loaded separately:

```text
engine.js
```

This keeps the document structure separate from the actual application logic.

Conceptually:

```text
index.html
    │
    ├── UI structure
    ├── Styling
    └── Canvas
          │
          ▼
      engine.js
          │
          ├── Application logic
          ├── Interaction
          ├── Garden simulation
          └── State
```

## The Garden

The main visual component is an HTML Canvas.

Instead of constructing every visual element as ordinary DOM elements, the garden can be treated as a small graphical system where objects are drawn and updated dynamically.

This makes the canvas a natural place for experimenting with:

* Procedural visuals
* Animation
* Growth
* Interaction
* Particles
* Trees
* Flowers
* Environmental effects

The garden is therefore not just a static webpage.

It is a small interactive simulation.

## Local State

The application uses browser-local state to remember information about the garden.

This allows the garden to persist between sessions without requiring a server.

The architecture is deliberately local:

```text
User
  ↓
Browser
  ↓
Local Storage
  ↓
Garden State
```

This was enough for the purpose of the project.

### A Known Limitation

Because the application is client-side, local state is inherently controlled by the user.

A technically curious person can open browser developer tools and modify Local Storage.

That means the application cannot treat Local Storage as a trusted source of truth.

For a game or competitive system, that would be a serious problem.

For this project, it is simply a consequence of the architecture.

The important distinction is:

> **Client-side persistence is storage, not security.**

If the browser controls the state, the person controlling the browser can ultimately modify that state.

## No Backend

One deliberate aspect of the project is that it does not require a server.

Everything happens inside the browser.

That means the project can be:

* Run locally
* Hosted as a static website
* Shared without maintaining infrastructure
* Used without a database
* Modified without a build system

For a small personal gift, this was exactly the right level of complexity.

There was no reason to build an entire backend for a garden whose purpose was simply to exist as a personal interactive experience.

## Design Philosophy

The project reflects something I enjoy about programming:

> **A program doesn't have to solve a huge commercial problem to be worth building.**

Sometimes the purpose of software is simply to create something that could not exist otherwise.

In this case, the constraints were actually part of the challenge:

```text
No money
   ↓
Build instead
   ↓
No infrastructure
   ↓
Use the browser
   ↓
No framework
   ↓
Build the experience directly
```

The limitation became the design.

## Why This Project Matters to Me

Love Garden is one of those projects where the technical complexity isn't the entire point.

I built it because I wanted to give someone something that came from me.

It represents a different kind of engineering goal:

```text
Not:
"How do I make money from this?"

Not:
"How do I make this scalable?"

But:
"Can I turn an idea into something that another person can experience?"
```

And the answer was yes.

## What I Learned

The project reinforced a simple lesson:

> **You don't need a huge stack to create something meaningful.**

HTML, CSS, JavaScript, a canvas, and some persistence were enough to create an entire little world.

It also reinforced the importance of understanding the environment you're working in.

The browser already provides:

* Rendering
* Storage
* Input
* Events
* Animation
* Networking
* A runtime

Instead of immediately reaching for a framework, the project uses the primitives already available.

## Security Note

This application is not designed as a security-critical system.

Local Storage should never be treated as a trusted database or a secure storage mechanism for secrets.

The application intentionally runs entirely on the client, so users have complete control over their local copy of the application state.

That is acceptable here because the goal is a personal interactive experience, not a tamper-resistant system.

## Running

Clone or download the project and open the HTML entry point in a modern browser.

The project consists of the HTML application shell and its JavaScript engine.

No server-side runtime is required.

## Project Structure

```text
.
├── index.html
└── engine.js
```

The HTML file contains the application shell, styling, UI root, and canvas.

`engine.js` contains the actual garden engine and interaction logic.

## Status

**Personal Project / Digital Gift**

Built as a small experiment in creating something meaningful entirely through code.

No expensive stack.

No backend.

No framework.

Just an idea, a browser, and the willingness to build it.
