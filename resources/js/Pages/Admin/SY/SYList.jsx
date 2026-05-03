import { React, useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function SYList() {
    const [schoolYears, setSchoolYears] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        label: "",
        start_date: "",
        end_date: "",
    });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log(name, value);

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const fetchSy = async () => {
        try {
            const res = await axios.get("/api/sy");
            setSchoolYears(res.data.schoolYear);
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
                await axios.put(`/api/sy/${editingId}`, formData);
                alert("S.Y updated successfully");
            } else {
                await axios.post("/api/sy", formData);
                alert("S.Y created successfully");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

        setFormData({
            label: "",
            start_date: "",
            end_date: "",
        });

        setEditingId(null);
        fetchSy();
    };

    const handleEdit = (sy) => {
        setEditingId(sy.id);

        setFormData({
            label: sy.label || "",
            start_date: sy.start_date || "",
            end_date: sy.end_date || "",
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this school year?")) return;

        try {
            await axios.delete(`/api/sy/${id}`);
            fetchSy();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (sy) => {
        handleEdit(sy);
        setShowForm(true);
        console.log("Hello, na click mo na ako");
    }

    useEffect(() => {
        fetchSy();
    }, []);

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div
                    className={`grid gap-6 ${
                        showForm ? "lg-grid-cols-3" : "grid-cols-"
                    }`}
                >
                    <div
                        className={`bg-white p-6 rounded-2xl shadow-sm ${showForm ? "col-span-5" : "hidden"}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-sembibold text-gray-700">
                                {editingId
                                    ? "Edit School Year"
                                    : "Add School Year"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 w-full">
                            <div>
                                <label className="text-sm text-gray-600">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    name="label"
                                    value={formData.label}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Optional"
                                />
                                <InputError message={errors.label} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                    <InputError message={errors.start_date} />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                    <InputError message={errors.end_date} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                                >
                                    {loading
                                        ? editingId
                                            ? "Updating..."
                                            : "Creating..."
                                        : editingId
                                          ? "Update School Year"
                                          : "Create School Year"}
                                </button>
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
                                    Add School Year
                                </button>
                            )}
                        </div>
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-1000">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        End Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {schoolYears.map((sy) => (
                                    <tr key={sy.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {sy.label}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {sy.start_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {sy.end_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(() => {
                                                const today = new Date();
                                                const start = sy.start_date
                                                    ? new Date(sy.start_date)
                                                    : null;
                                                const end = sy.end_date
                                                    ? new Date(sy.end_date)
                                                    : null;

                                                let status = "Inactive";
                                                let bgColor = "bg-red-500";

                                                if (!start || start > today) {
                                                    status = "Upcoming";
                                                    bgColor = "bg-blue-500";
                                                } else if (
                                                    start &&
                                                    end &&
                                                    today >= start &&
                                                    today <= end
                                                ) {
                                                    status = "Active";
                                                    bgColor = "bg-green-500";
                                                }

                                                return (
                                                    <span
                                                        className={`px-2 py-1 rounded text-white ${bgColor}`}
                                                    >
                                                        {status}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => handleEditClick(sy)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(sy.id)
                                                    
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
                {/* <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit School Year" : "Create School Year"}
                    </h2>

                    
                </div> */}
            </div>
        </AdminLayout>
    );
}
