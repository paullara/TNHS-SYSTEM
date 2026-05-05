import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import { X } from "lucide-react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function TeacherSubject() {
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [schoolYears, setSchoolYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        teacher_id: "",
        subject_id: "",
        school_year_id: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchTeacherSubjects = async () => {
        try {
            const res = await axios.get("/api/ts");
            setTeacherSubjects(res.data.teacherSubject);
        } catch (err) {
            console.error("Failed to fetch the teacherSubjects", err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await axios.get("/api/teachers");
            setTeachers(res.data.teachers);
        } catch (err) {
            console.error("Failed to retrieve teachers", err);
        }
    };

    const fetchSchoolYears = async () => {
        try {
            const res = await axios.get("/api/sy");
            setSchoolYears(res.data.schoolYear);
        } catch (err) {
            console.error("Failed to retrieve S.Y", err);
        }
    };

    const fetchSubjects = async () => {
        try {
            const res = await axios.get("/api/subjects");
            setSubjects(res.data.subjects);
        } catch (err) {
            console.error("Error fetching subjects", err);
        }
    };

    useEffect(() => {
        fetchTeacherSubjects();
        fetchSubjects();
        fetchTeachers();
        fetchSchoolYears();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/ts/${editingId}`, formData);
            } else {
                await axios.post("/api/ts", formData);
            }

            setFormData({
                teacher_id: "",
                subject_id: "",
                school_year_id: "",
            });

            setEditingId(null);
            fetchTeacherSubjects();
        } catch (err) {
            console.error("Failed to assign teacher", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (teacherSubject) => {
        setEditingId(teacherSubject.id);

        setFormData({
            teacher_id: teacherSubject.teacher_id,
            subject_id: teacherSubject.subject_id,
            school_year_id: teacherSubject.school_year_id,
        });
    };

    const handleEditClick = (teacherSubject) => {
        handleEdit(teacherSubject);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this teacher subject?")) return;

        try {
            await axios.delete(`/api/ts/${id}`);
            fetchTeacherSubjects();
        } catch (err) {
            console.error("Failed to delete teacher subject.", err);
        }
    };

    return (
        <Admin>
            <div className="min-h-screen bg-gray-50 p-6">
                <div
                    className={`grid gap-6 ${showForm ? "lg-grid-cols-3" : "grid-cols"}`}
                >
                    <div
                        className={`bg-white p-6 rounded-2xl shadow-sm ${showForm ? "col-span-5" : "hidden"}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                {editingId
                                    ? "Make Changes"
                                    : "Assign New Subject"}
                            </h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X />
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Teacher
                                    </label>
                                    <select
                                        name="teacher_id"
                                        value={formData.teacher_id}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value>Select Teacher</option>
                                        {teachers.map((teacher) => (
                                            <option
                                                key={teacher.id}
                                                value={teacher.id}
                                            >
                                                {teacher.firstname} {}{" "}
                                                {teacher.middlename} {}{" "}
                                                {teacher.lastname}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.teacher_id} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Subject
                                    </label>
                                    <select
                                        name="subject_id"
                                        value={formData.subject_id}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map((subject) => (
                                            <option
                                                key={subject.id}
                                                value={subject.id}
                                            >
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.subject_id} />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        School Year
                                    </label>
                                    <select
                                        name="school_year_id"
                                        value={formData.school_year_id}
                                        onChange={handleChange}
                                        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select School Year
                                        </option>
                                        {schoolYears.map((sy) => (
                                            <option key={sy.id} value={sy.id}>
                                                {sy.label}
                                            </option>
                                        ))}
                                    </select>
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
                                          ? "Update Teacher Subject"
                                          : "Assign Teacher"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div
                        className={`bg-white p-6 h-[500px] rouded-2xl shadow-sm overflow-auto ${showForm ? "col-span-5" : "col-span-1"}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Assigned Subject List
                            </h2>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Assign New Subject
                                </button>
                            )}
                        </div>
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Subject
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        School Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {teacherSubjects.map((ts) => (
                                    <tr key={ts.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ts.teacher.firstname}
                                            {} {ts.teacher.middlename} {}{" "}
                                            {ts.teacher.lastname}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ts.subject.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {ts.school_year.label}
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEditClick(ts)
                                                }
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                                onClick={() =>
                                                    handleDelete(ts.id)
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
            </div>
        </Admin>
    );
}
