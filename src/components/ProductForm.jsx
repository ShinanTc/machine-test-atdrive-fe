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

    const fieldStyle = { marginBottom: "1rem" }; // padding between fields

    return (
        <form onSubmit={submitHandler}>
            <div style={fieldStyle}>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>
            <div style={fieldStyle}>
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />
            </div>
            <div style={fieldStyle}>
                <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
            </div>
            <div style={fieldStyle}>
                <button type="submit">{selected ? "Update" : "Add"}</button>
                {selected && <button type="button" onClick={clearEdit} style={{ marginLeft: "0.5rem" }}>Cancel</button>}
            </div>
        </form>
    );
}
