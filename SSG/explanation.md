# Static Site Generation (SSG) Explanation

## React Component (App.js)

```javascript
import { createElement as h } from "react";

function App() {
  return h(
    "div",
    null,
    h("h1", null, "Hello Frontend Masters"),
    h("p", null, "This is SSG")
  );
}

export default App;
```

### What's happening here?

`createElement` is the raw version of JSX. Normally we write:

```jsx
<div>
  <h1>Hello</h1>
  <p>SSG</p>
</div>
```

Here, instead, we write:

```javascript
h("div", null, h("h1", null, "Hello Frontend Masters"), h("p", null, "This is SSG"))
```

**Function signature:** `h(type, props, ...children)`

- **type** → HTML tag or component
- **props** → object with attributes (like id, className, etc)
- **children** → content inside the element

`export default App` → allows us to import it in build.js.

So `App()` returns React elements in memory, not HTML yet.

## The Build Script (build.js)

This is the core of SSG.

```javascript
import { renderToStaticMarkup } from "react-dom/server";
import { createElement as h } from "react";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import App from "./App.js";
```

### What each import does:

- **renderToStaticMarkup** → converts React elements into plain HTML string. No React runtime needed.
- **createElement** → used if we need to create elements here (same as in App.js).
- **fs functions** → read/write files and manage folders.
- **url/path** → helps to get absolute file paths.
- **App** → our React component.

### Get current file path

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distPath = path.join(__dirname, "dist");
```

- `__filename` → full path of build.js.
- `__dirname` → folder containing build.js.
- `distPath` → where we will put the final static files (dist/ folder).

### Read HTML template

```javascript
const shell = readFileSync(path.join(__dirname, "index.html"), "utf8");
```

- Reads the index.html file.
- Stores it as a string in `shell`.

### Render React component to HTML

```javascript
const app = renderToStaticMarkup(h(App));
const html = shell.replace("<!--ROOT-->", app);
```

**renderToStaticMarkup(h(App))**
- `h(App)` → creates the React element of App.
- `renderToStaticMarkup` → turns it into HTML string.

**shell.replace("<!--ROOT-->", app)**
- Replaces the placeholder in index.html with the rendered HTML.
- Now `html` contains complete HTML of our page.

### Create dist folder (or clean it if exists)

```javascript
if (!existsSync(distPath)) {
  mkdirSync(distPath);
} else {
  const files = readdirSync(distPath);
  for (const file of files) {
    unlinkSync(path.join(distPath, file));
  }
}
```

- If `dist/` doesn't exist → create it.
- If `dist/` exists → delete all existing files.
- Ensures a clean build every time.

### Write final HTML to file

```javascript
writeFileSync(path.join(distPath, "index.html"), html);
```

- Saves our generated HTML into `dist/index.html`.
- That's it! This file is now a static HTML page.

## Key Concepts

| Concept | Plain English Explanation |
|---------|---------------------------|
| React Component | Template that describes UI |
| renderToStaticMarkup | Converts React component → plain HTML |
| HTML shell | Frame for the page where we inject content |
| dist folder | Output folder for final static HTML |
| SSG | Pre-render pages once → serve them as HTML |

## Optional: Adding Interactivity

Right now the page is static → no React running in browser.

If you want buttons, forms, or React features in browser, you would include:

- React runtime JS (react-dom/client)
- Use `hydrateRoot` instead of `render`

But for blogs or course pages → you don't need this.

## Summary (Visual Flow)

1. You write React code in App.js.
2. build.js reads the template (index.html).
3. React component → HTML string (renderToStaticMarkup).
4. Inject HTML string into template.
5. Save final HTML to dist/index.html.
6. Open dist/index.html → fully-rendered static page.
