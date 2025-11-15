import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../redux/slices/productSlice";

export default function ProductList({ onEdit }) {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    console.log("Products state:", items);

    return (
        <div>
            <h2>Products</h2>
            {items.map((p) => (
                <div key={p._id}>
                    <strong>{p.name}</strong> — ${p.price}
                    <p>{p.description}</p>
                    <button onClick={() => onEdit(p)}>Edit</button>
                    <button onClick={() => dispatch(deleteProduct(p._id))}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
