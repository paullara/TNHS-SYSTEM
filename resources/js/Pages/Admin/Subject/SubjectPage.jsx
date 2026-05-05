import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import { X } from "lucide-react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function SubjectPage() {
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [gradeLevels, setGradeLevels] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        semester: "",
        grade_level_id: "",
        section_id: "",
        subject_indicate: "",
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
                subject_indicate: "",
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
            subject_indicate: subject.subject_indicate,
            grade_level_id: subject.grade_level_id,
            section_id: subject.section_id,
        });
    };

    const handleEditClick = (subject) => {
        handleEdit(subject);
        setShowForm(true);
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
                            <h2 className="text-xl font-semibold text-gray-700">
                                {editingId ? "Edit Subject" : "Add New Subject"}
                            </h2>
                            <button
                                onClick={() => setShowForm()}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 w-full"
                        >
                            <div className="grid grid-cols-2 gap-4">
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
                                        <option value="">
                                            Select Semester
                                        </option>
                                        <option value="1ST">
                                            1st Semester
                                        </option>
                                        <option value="2ND">
                                            2nd Semester
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label>Subject Indicate</label>
                                <select
                                    name="subject_indicate"
                                    value={formData.subject_indicate}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:ring:2 focus:ring-blue-500"
                                >
                                    <option value="">
                                        Select Subject Indicate
                                    </option>
                                    <option value="Core">Core</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Specialized">
                                        Specialized
                                    </option>
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
                                        <option
                                            key={section.id}
                                            value={section.id}
                                        >
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
                    <div
                        className={`bg-white p-6 h-[500px] rounded-2xl shadow-sm overflow-auto ${showForm ? "col-span-5" : "col-span-1"}`}
                    >
                        <div className="flex justify-between items-center mb-4  ">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Subject List
                            </h2>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Add Subject
                                </button>
                            )}
                        </div>
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Grade Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Section
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject) => (
                                    <tr key={subject.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {subject.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {subject.grade_level.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {subject.section.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                                            <button
                                                onClick={() =>
                                                    handleEdit(subject)
                                                }
                                                className="bg-green-600 rounded-md text-white h-[25px] w-[100px] hover:bg-green-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(subject.id)
                                                }
                                                className="bg-red-600 rounded-md text-white h-[25px] w-[100px] hover:bg-green-700"
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
