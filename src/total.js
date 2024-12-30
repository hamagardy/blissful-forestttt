import React, { useState, useEffect } from "react";

function Total({ inventory, setInventory }) {
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    qty: "",
    price: "",
  });
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTimeout, setPasswordTimeout] = useState(null);

  // Calculate total number of items and total stock quantity
  const totalItems = inventory.length;
  const totalStockQuantity = inventory.reduce((acc, item) => acc + item.qty, 0);

  // Function to check if the password has been entered recently
  const isPasswordValid = () => {
    return passwordTimeout && new Date() < passwordTimeout;
  };

  const handleEditQuantity = (itemId) => {
    if (!isPasswordValid()) {
      setPasswordModalOpen(true);
      setEditingItem(itemId); // Set this to remember which item we want to edit
      setNewQuantity("");
    } else {
      setEditingItem(itemId); // If password is valid, just start editing
    }
  };

  const handleSaveQuantity = (itemId) => {
    if (newQuantity === "" || isNaN(newQuantity) || newQuantity < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const updatedInventory = inventory.map((item) =>
      item.id === itemId ? { ...item, qty: parseInt(newQuantity) } : item
    );
    setInventory(updatedInventory);
    setEditingItem(null); // Close edit mode
    setNewQuantity(""); // Reset input field
  };

  const handleRemoveItem = (itemId) => {
    if (!isPasswordValid()) {
      setPasswordModalOpen(true);
    } else {
      const updatedInventory = inventory.filter((item) => item.id !== itemId);
      setInventory(updatedInventory);
    }
  };

  const confirmRemoveItem = (itemId) => {
    if (password !== "gardy1234") {
      alert("Incorrect Password");
      return;
    }

    const updatedInventory = inventory.filter((item) => item.id !== itemId);
    setInventory(updatedInventory);
    setPasswordModalOpen(false);
    setPassword("");
    setPasswordTimeout(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
  };

  const handleAddItem = () => {
    if (!isPasswordValid()) {
      setPasswordModalOpen(true);
    } else {
      setIsAddingNewItem(true);
    }
  };

  const confirmAddItem = () => {
    if (password !== "gardy1234") {
      alert("Incorrect Password");
      return;
    }

    setIsAddingNewItem(true);
    setPasswordModalOpen(false);
    setPassword("");
    setPasswordTimeout(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
  };

  const handleSaveNewItem = () => {
    const { name, qty, price } = newItem;

    if (
      !name ||
      !qty ||
      !price ||
      isNaN(qty) ||
      isNaN(price) ||
      qty <= 0 ||
      price <= 0
    ) {
      alert("Please fill in all fields with valid values.");
      return;
    }

    const newInventoryItem = {
      id: inventory.length + 1,
      name,
      qty: parseInt(qty),
      price: parseFloat(price),
    };

    setInventory([...inventory, newInventoryItem]);
    setIsAddingNewItem(false); // Close the form
    setNewItem({ name: "", qty: "", price: "" }); // Reset the new item form
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Total Stock Overview
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
        <p className="mb-4">Total Items in Inventory: {totalItems}</p>
        <p>Total Stock Quantity: {totalStockQuantity}</p>
      </div>

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-2 w-full border rounded"
            />
            <button
              onClick={() => {
                if (editingItem !== null) confirmRemoveItem(editingItem);
                else if (isAddingNewItem) confirmAddItem();
                else confirmRemoveItem(editingItem); // Note: This assumes editingItem holds the itemId for removal
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setPasswordModalOpen(false);
                setPassword("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add New Item
        </button>
      </div>

      {/* Form for adding a new item */}
      {isAddingNewItem && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Add New Item</h3>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="mb-4 p-2 w-full"
            />
            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              value={newItem.qty}
              onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
              className="mb-4 p-2 w-full"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="mb-4 p-2 w-full"
            />
          </div>
          <button
            onClick={handleSaveNewItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save Item
          </button>
          <button
            onClick={() => setIsAddingNewItem(false)}
            className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}

      {/* List of items with options to edit quantity or remove */}
      <table className="min-w-full text-gray-900 dark:text-slate-50">
        <thead>
          <tr className="bg-gray-100 dark:bg-slate-700">
            <th className="p-4 text-left">Item ID</th>
            <th className="p-4 text-left">Item Name</th>
            <th className="p-4 text-left">Quantity</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="p-4">{item.id}</td>
              <td className="p-4">{item.name}</td>
              <td className="p-4">
                {editingItem === item.id ? (
                  <div>
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="p-2 w-32"
                    />
                    <button
                      onClick={() => handleSaveQuantity(item.id)}
                      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  item.qty
                )}
              </td>
              <td className="p-4">
                {editingItem === item.id ? (
                  <button
                    onClick={() => {
                      setEditingItem(null);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditQuantity(item.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Edit Quantity
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Remove Item
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Total;
