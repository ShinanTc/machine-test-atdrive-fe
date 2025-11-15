import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../redux/slices/productSlice";

export default function ProductForm({ selected, clearEdit }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ name: "", price: "", description: "" });

    useEffect(() => {
        if (selected) setForm(selected);
    }, [selected]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (selected) {
            dispatch(updateProduct({ id: selected._id, data: form }));
            clearEdit();
        } else {
            dispatch(addProduct(form));
        }
        setForm({ name: "", price: "", description: "" });
    };

    return (
        <form onSubmit={submitHandler}>
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
            />
            <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
            />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
            />
            <button type="submit">{selected ? "Update" : "Add"}</button>
            {selected && <button onClick={clearEdit}>Cancel</button>}
        </form>
    );
}
