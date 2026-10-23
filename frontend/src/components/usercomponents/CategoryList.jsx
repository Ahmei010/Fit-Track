import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus, Layers, X, Save, AlertTriangle } from "lucide-react";

const CategoryList = ({ categories, setCategories, onAdd }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.categoryName);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setEditLoading(true);
      const res = await axios.put(
        `http://localhost:5000/category/update/${editingCategory._id}`,
        {
          categoryName: editName.trim(),
        }
      );

      toast.success("Category updated successfully");
      setCategories((prev) =>
        prev.map((item) =>
          item._id === editingCategory._id ? res.data.updatedCategory : item
        )
      );
      cancelEdit();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `http://localhost:5000/category/delete/${deleteTarget._id}`
      );

      toast.success(`Category "${deleteTarget.categoryName}" deleted`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            WORKOUT STRUCTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Workout Categories
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Group exercises by muscle target, workout split, or intensity
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Active Categories</h2>
              <p className="text-xs text-gray-400">
                {categories.length} category definition(s)
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-6">#</th>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Created Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                        {cat.categoryName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-white/10 hover:border-orange-500/30 text-xs font-semibold transition"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <Layers size={36} className="mx-auto mb-3 text-gray-600" />
                    <p className="font-semibold text-gray-400">No categories found</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Click "Add Category" to create muscle groups or workout types.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit Category Modal (Replaces browser prompt) ── */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-md bg-[#16161d] border border-white/15 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Edit size={16} />
                </div>
                <h3 className="text-lg font-bold text-white">Edit Category</h3>
              </div>
              <button
                onClick={cancelEdit}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm"
                  placeholder="e.g. Chest, Legs, Cardio"
                  required
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{editLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal (Replaces browser window.confirm) ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-md bg-[#16161d] border border-red-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Category</h3>
                <p className="text-xs text-gray-400">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">
                "{deleteTarget.categoryName}"
              </span>
              ? If exercises are assigned to this category, deletion will be blocked by the server to protect your data.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;