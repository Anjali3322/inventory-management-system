import { useState } from "react";
import Common from "../components/Common";
import CategoryModal from "../components/CategoryModal";
import Tables from "../components/Tables";

const Categories = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics",
      description: "Electronic Devices",
      status: "Active",
    },
  ]);

  const handleEdit = (item) => {
    setSelectedCategory(item);

    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = (formData) => {
    if (selectedCategory) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === selectedCategory.id ? { ...item, ...formData } : item,
        ),
      );
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...formData,
      };

      setCategories((prev) => [...prev, newCategory]);
    }
  };
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search Category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border w-72 px-4 py-2 rounded-md outline-none"
        />

        <Common
          text="+ Add Category"
          onClick={() => {
            setSelectedCategory(null);
            setOpenModal(true);
          }}
        />
      </div>

      <Tables
        columns={["ID", "Category", "Description", "Status", "Action"]}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={selectedCategory}
        onSave={handleSave}
      />
    </div>
  );
};

export default Categories;
