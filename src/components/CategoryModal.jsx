import { useState, useEffect } from "react";
import Common from "./Common";

const CategoryModal = ({ open, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: "",
        description: "",
        status: "Active",
      });
    }
  }, [category]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded-lg w-[450px] p-6">
        <h2 className="text-2xl font-bold mb-5">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Category Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <Common text="Cancel" bgColor="bg-gray-500" onClick={onClose} />

            <Common text={category ? "Update" : "Save"} type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
