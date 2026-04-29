import Admin from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function Enrollment() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [gradeLevels, setGradeLevels] = useState([]);
    const [sections, setSections] = useState([]);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        student_id: "",
        school_year_id: "",
        grade_level_id: "",
        section_id: "",
        strand: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchEnrollments = async () => {
        try {
            const res = await axios.get("/api/enrollments");
            setEnrollments(res.data.enrollments);
        } catch (err) {
            console.error("Failed to fetch the enrollments", err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get("/api/students");
            setStudents(res.data.students);
        } catch (err) {
            console.error("Error fetching students", err);
        }
    };

    const fetchSchoolYears = async () => {
        try {
            const res = await axios.get("/api/sy");
            setSchoolYears(res.data.schoolYear);
        } catch (err) {
            console.error("Error fetching school years", err);
        }
    };

    const fetchGradeLevels = async () => {
        try {
            const res = await axios.get("/api/gl");
            setGradeLevels(res.data.gradeLevel);
        } catch (err) {
            console.error("Failed fetching gradeLevels", err);
        }
    };

    const fetchSections = async () => {
        try {
            const res = await axios.get("/api/sections");
            setSections(res.data.sections);
        } catch (err) {
            console.error("Failed fetching sections", err);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchSchoolYears();
        fetchGradeLevels();
        fetchSections();
        fetchEnrollments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/enrollments/${editingId}`, formData);
            } else {
                await axios.post("/api/enrollments", formData);
                alert("Created");
            }

            setFormData({
                student_id: "",
                school_year_id: "",
                grade_level_id: "",
                section_id: "",
                strand: "",
            });
            setEditingId(null);
            fetchEnrollments();
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            console.error("Failed to create enrollment", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (enrollment) => {
        setEditingId(enrollment.id);

        setFormData({
            student_id: enrollment.student_id,
            school_year_id: enrollment.school_year_id,
            grade_level_id: enrollment.grade_level_id,
            section_id: enrollment.section_id,
            strand: enrollment.strand,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this enrollment?")) return;

        try {
            await axios.delete(`/api/enrollments/${id}`);
            fetchEnrollments();
        } catch (err) {
            console.error("Failed to delete enrollment", err);
        }
    };
    console.log("Enrollments", enrollments);

    return (
        <Admin>
            <div className="h-screen">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6 mb-8">
                    <h2>{editingId ? "Edit Enrollment" : "Add Enrollment"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">
                                Student
                            </label>
                        </div>
                        <div>
                            <select
                                name="student_id"
                                value={formData.student_id}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.firstname} {} {""}
                                        {student.middlename} {} {""}
                                        {student.lastname} {} {""}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.student_id} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">
                                School Year
                            </label>

                            <select
                                name="school_year_id"
                                value={formData.school_year_id}
                                onChange={handleChange}
                                className="w-full border rouded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select School Year</option>
                                {schoolYears.map((sy) => (
                                    <option key={sy.id} value={sy.id}>
                                        {sy.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.school_year_id} />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">
                                Strand
                            </label>
                            <select
                                name="strand"
                                value={formData.strand}
                                onChange={handleChange}
                                className="w-full border rounded-md px-3 py-2 focus:ring:2 focus:ring-blue-500"
                            >
                                <option value="">Select Strand</option>
                                <option value="Humanities and Social Sciences">
                                    Humanities and Social Sciences
                                </option>
                                <option value="Technical-Vocational-Livelihood">
                                    Technical-Vocational-Livelihood
                                </option>
                                <option value="General Academic Strand">
                                    General Academic Strand
                                </option>
                            </select>
                            <InputError message={errors.strand} />
                        </div>
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
                                <option>Select Grade Level</option>
                                {gradeLevels.map((gl) => (
                                    <option key={gl.id} value={gl.id}>
                                        {gl.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.grade_level_id} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">
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
                            <InputError message={errors.section_id} />
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
                                      ? "Update Enrollment"
                                      : "Create Enrollment"}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="h-9/10 w-full">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <table className="w-full table-auto divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    Grade Level
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    Section
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    School Year
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    Strand
                                </th>
                                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                    Action
                                </th>
                            </thead>
                            <tbody className="bg-white">
                                {enrollments.map((enrollment) => (
                                    <tr key={enrollment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.student.firstname}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.grade_level.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.section.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.school_year.label}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {enrollment.strand}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() =>
                                                    handleEdit(enrollment)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(enrollment.id)
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
