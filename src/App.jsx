import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product CRUD App</h1>

      <ProductForm selected={selected} clearEdit={() => setSelected(null)} />
      <hr />
      <ProductList onEdit={(product) => setSelected(product)} />
    </div>
  );
}
