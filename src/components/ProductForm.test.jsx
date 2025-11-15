import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductForm from "./ProductForm";
import { vi } from "vitest";

// Mock the slice - mocks must be defined inside the factory function
vi.mock("../redux/slices/productSlice", () => ({
    addProduct: vi.fn((payload) => ({ type: "product/addProduct", payload })),
    updateProduct: vi.fn((payload) => ({ type: "product/updateProduct", payload })),
    __esModule: true,
    // Provide a simple reducer that returns initial state
    default: (state = { products: [], loading: false, error: null }) => state,
}));

// Import the mocked functions after the mock is defined
import { addProduct, updateProduct } from "../redux/slices/productSlice";

// Helper to render with a real store
const renderWithStore = (ui, { preloadedState } = {}) => {
    const store = configureStore({
        reducer: {
            product: (state = { products: [], loading: false, error: null }) => state
        },
        preloadedState,
    });

    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        store,
    };
};

describe("ProductForm Component", () => {
    let clearEditMock;

    beforeEach(() => {
        clearEditMock = vi.fn();
        // Clear mock calls before each test
        vi.clearAllMocks();
    });

    test("renders form fields", () => {
        renderWithStore(<ProductForm clearEdit={clearEditMock} />);
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    test("fills form and dispatches addProduct on submit", () => {
        renderWithStore(<ProductForm clearEdit={clearEditMock} />);

        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: "Test Product" } });
        fireEvent.change(screen.getByPlaceholderText(/price/i), { target: { value: "100" } });
        fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: "Test description" } });

        fireEvent.click(screen.getByRole("button", { name: /add/i }));

        expect(addProduct).toHaveBeenCalledWith({
            name: "Test Product",
            price: "100",
            description: "Test description",
        });
    });

    test("pre-fills form when selected product is passed and updates on submit", () => {
        const selected = { _id: "123", name: "Old Product", price: "50", description: "Old description" };
        renderWithStore(<ProductForm selected={selected} clearEdit={clearEditMock} />);

        expect(screen.getByDisplayValue(selected.name)).toBeInTheDocument();
        expect(screen.getByDisplayValue(selected.price)).toBeInTheDocument();
        expect(screen.getByDisplayValue(selected.description)).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: "Updated Product" } });
        fireEvent.click(screen.getByRole("button", { name: /update/i }));

        expect(updateProduct).toHaveBeenCalledWith({
            id: selected._id,
            data: { ...selected, name: "Updated Product" },
        });
        expect(clearEditMock).toHaveBeenCalled();
    });

    test("calls clearEdit when cancel button is clicked", () => {
        const selected = { _id: "123", name: "Old Product", price: "50", description: "Old description" };
        renderWithStore(<ProductForm selected={selected} clearEdit={clearEditMock} />);

        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
        expect(clearEditMock).toHaveBeenCalled();
    });
});