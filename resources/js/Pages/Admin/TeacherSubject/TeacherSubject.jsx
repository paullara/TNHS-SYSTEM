import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function TeacherSubject() {
    const [teacherSubjects, setTeacherSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
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
            <div className="h-screen">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit Teacher Subject" : "Assign Teacher"}
                    </h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                    <option key={teacher.id} value={teacher.id}>
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
                                    <option key={subject.id} value={subject.id}>
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
                                <option value="">Select School Year</option>
                                {schoolYears.map((sy) => (
                                    <option key={sy.id} value={sy.id}>
                                        {sy.label}
                                    </option>
                                ))}
                            </select>
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
                <div className="h-9/10 w-full">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
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
                                                onClick={() => handleEdit(ts)}
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
