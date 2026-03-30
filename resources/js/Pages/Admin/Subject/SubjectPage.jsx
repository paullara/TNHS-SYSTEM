import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function SubjectPage() {
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [gradeLevels, setGradeLevels] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        semester: "",
        grade_level_id: "",
        section_id: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get("/api/subjects");
            setSubjects(res.data.subjects);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGradeLevels = async () => {
        try {
            const res = await axios.get("/api/gl");
            setGradeLevels(res.data.gradeLevel);
        } catch (err) {
            console.error("Failed to retrieve the grade levels", err);
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/sections");
            setSections(res.data.sections);
        } catch (err) {
            console.error("Failed to retrieve sections", err);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchGradeLevels();
        fetchSections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/subjects/${editingId}`, formData);
            } else {
                await axios.post("/api/subjects", formData);
                alert("Created Successfully");
            }

            setFormData({
                name: "",
                semester: "",
                grade_level_id: "",
                section_id: "",
            });
            setEditingId(null);
            fetchSubjects();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (subject) => {
        setEditingId(subject.id);

        setFormData({
            name: subject.name,
            semester: subject.semester,
            grade_level_id: subject.grade_level_id,
            section_id: subject.section_id,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this subject?")) return;
        try {
            await axios.delete(`/api/subjects/${id}`);
            fetchSubjects();
        } catch (err) {
            console.error("Failed to delete this subject.", err);
        }
    };

    return (
        <Admin>
            <div className="h-screen">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit Subject" : "Create Subject"}
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-flow-col grid-rows-2 gap-4"
                    >
                        <div>
                            <label className="text-xs text-gray-600">
                                Subject Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring-blue-500"
                                placeholder="Subject Name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label>Semester</label>

                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring:2 focus:ring-blue-500"
                            >
                                <option value="">Select Semester</option>
                                <option value="1ST">1st Semester</option>
                                <option value="2ND">2nd Semester</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">
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
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600">
                                Section
                            </label>
                            <select
                                name="section_id"
                                value={formData.section_id}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Section</option>
                                {sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.name} />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-5 py-2 rounded-md text-sm font-md disabled:opacity-50"
                            >
                                {loading
                                    ? editingId
                                        ? "Updating"
                                        : "Creating"
                                    : editingId
                                      ? "Update Subject"
                                      : "Create Subject"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h=9/10 w-full bg-red-500">
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Grade Level</th>
                                <th>Section</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td>{subject.name}</td>
                                    <td>{subject.grade_level.name}</td>
                                    <td>{subject.section.name}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(subject)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(subject.id)
                                            }
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
        </Admin>
    );
}
