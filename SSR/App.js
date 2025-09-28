import { createElement as h } from "react";
function App() {
  const [count, setCount] = useState(0);
  return h(
    "div",
    null,
    h("h1", null, "Count: ", count),
    h("button", { onClick: () => setCount(count + 1) }, `Count: ${count}`),
  );
}
export default App;
