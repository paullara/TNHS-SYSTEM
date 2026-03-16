import { React, useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function SectionList() {
    const [sections, setSections] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [gradeLevels, setGradeLevels] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        grade_level_id: "",
        adviser_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/sections/${editingId}`, formData);
                alert("Section updated successfully");
            } else {
                await axios.post("/api/sections", formData);
                alert("Section created successfully");
            }

            setFormData({
                name: "",
                grade_level_id: "",
                adviser_id: "",
            });

            setEditingId(null);
            fetchSections();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section) => {
        setEditingId(section.id);

        setFormData({
            name: section.name,
            grade_level_id: section.grade_level_id,
            adviser_id: section.adviser_id,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this section?")) return;

        try {
            await axios.delete(`/api/sections/${id}`);
            fetchSections();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await axios.get("/api/teachers");
                setTeachers(res.data.teachers);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTeacher();
    }, []);

    useEffect(() => {
        const fetchGradeLevels = async () => {
            try {
                const res = await axios.get("/api/gl");
                setGradeLevels(res.data.gradeLevel);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGradeLevels();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/sections");
            setSections(res.data.sections);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchSections();
    }, []);
    console.log(sections.adviser);
    console.log("Teachers", teachers);
    console.log("Grade Levels", gradeLevels);
    console.log(sections);
    return (
        <AdminLayout>
            <div className="h-screen ">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit Section" : "Create Section"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Section Name */}
                        <div>
                            <label className="text-sm text-gray-600">
                                Section Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter section name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Two Inputs Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Adviser */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Adviser
                                </label>
                                <select
                                    name="adviser_id"
                                    value={formData.adviser_id}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.firstname}{" "}
                                            {teacher.lastname}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.adviser_id} />
                            </div>

                            {/* Grade Level */}
                            <div>
                                <label className="text-sm text-gray-600">
                                    Grade Level
                                </label>
                                <select
                                    name="grade_level_id"
                                    value={formData.grade_level_id}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Grade Level</option>
                                    {gradeLevels.map((gradeLevel) => (
                                        <option
                                            key={gradeLevel.id}
                                            value={gradeLevel.id}
                                        >
                                            {gradeLevel.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.grade_level_id} />
                            </div>
                        </div>

                        {/* Button */}
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
                                      ? "Update Section"
                                      : "Create Section"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h-9/10 w-full">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Section
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-500 uppercase">
                                        Adviser
                                    </th>
                                    <th className="px-6 py-3 text-left text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {sections.map((section) => (
                                    <tr key={section.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {section.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {section.grade_level.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {`${section.adviser.firstname} ${section.adviser.middlename ?? ""} ${section.adviser.lastname}`}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(section)
                                                }
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(section.id)
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
        </AdminLayout>
    );
}
