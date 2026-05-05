import { React, useState, useEffect } from "react";
import Admin from "@/Layouts/AdminLayout";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function GradeLevel() {
    const [gradeLevels, setGradeLevels] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (gl) => {
        setEditingId(gl.id);

        setFormData({
            name: gl.name,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this grade level?")) return;

        try {
            await axios.delete(`/api/gl/${id}`);
            fetchGradeLevels();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/gl/${editingId}`, formData);
            } else {
                await axios.post("/api/gl", formData);
                alert("Created successfully");
            }

            setFormData({
                name: "",
            });
            setEditingId(null);
            fetchGradeLevels();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGradeLevels = async () => {
        try {
            const res = await axios.get("/api/gl");
            setGradeLevels(res.data.gradeLevel);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (gl) => {
        handleEdit(gl);
        setShowForm(true);
    };

    console.log("Grade Levels", gradeLevels);

    useEffect(() => {
        fetchGradeLevels();
    }, []);

    return (
        <Admin>
            <div className="min-h-screen bg-gray-50 p-6">
                <div
                    className={`grid gap-6 ${
                        showForm ? "lg-grid-cols-3" : "grid-cols"
                    }`}
                >
                    <div
                        className={`bg-white p-6 rounded-2xl shadow-sm ${
                            showForm ? "col-span-5" : "hidden"
                        }`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2>
                                {editingId
                                    ? "Edit Grade Level"
                                    : "Add Grade Level"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 w-full"
                        >
                            <div className="flex justify-start items-end gap-4">
                                <div className="w-1/2">
                                    <label className="text-sm text-gray-600">
                                        Grade Level
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ml-2"
                                        placeholder="Grade level"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex items-center justify-center ">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50 h-[42px]"
                                    >
                                        {loading
                                            ? editingId
                                                ? "Updating..."
                                                : "Creating"
                                            : editingId
                                              ? "Update Section"
                                              : "Create Grade Level"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div
                        className={`bg-white p-6 h-[500px] rounded-2xl shadow-sm overflow-auto ${showForm ? "col-span-5" : "col-span-1"}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                School Year List
                            </h2>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Add Grade Level
                                </button>
                            )}
                        </div>
                        <table className="w-full table-auto divide-y">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {gradeLevels.map((gl) => (
                                    <tr key={gl.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {gl.name}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEditClick(gl)
                                                }
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(gl.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Admin>
    );
}
