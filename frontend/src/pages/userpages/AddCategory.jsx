import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CategoryList from "../../components/usercomponents/CategoryList";
import { Plus, Tag, X, FolderPlus } from "lucide-react";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/category/create", {
        categoryName: categoryName.trim(),
      });

      toast.success("Category added successfully");
      setCategoryName("");
      await getCategories();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] text-white">
      {/* ── Category List View ── */}
      {!showForm && (
        <CategoryList
          categories={categories}
          setCategories={setCategories}
          onAdd={() => setShowForm(true)}
        />
      )}

      {/* ── Add Form ── */}
      {showForm && (
        <div className="max-w-xl mx-auto py-4 animate-fade-in-up">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <FolderPlus size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Add Workout Category</h1>
                <p className="text-xs text-gray-400">
                  Create a new muscle group or workout training split
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-white">
                  New Category Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCategoryName("");
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chest, Legs, Back, Arms, Core, Cardio"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>{loading ? "Adding..." : "Add Category"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setCategoryName("");
                  }}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <p className="text-xs text-gray-500 text-center mt-5">
            💡 Categories help you organize exercises and track performance across muscle groups.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddCategory;