import Admin from "@/Layouts/AdminLayout";
import InputError from "@/Components/InputError";
import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentCreate() {
    const [students, setStudents] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        LRN: "",
        firstname: "",
        middlename: "",
        lastname: "",
        birthdate: "",
        gender: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            if (editingId) {
                await axios.put(`/api/students/${editingId}`, formData);
            } else {
                await axios.post("/api/students", formData);
            }
            fetchStudents();
            setFormData({
                LRN: "",
                firstname: "",
                middlename: "",
                lastname: "",
                birthdate: "",
                gender: "",
                address: "",
            });
        } catch (err) {
            console.log("ERROR:", err.response);

            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.id);

        setFormData({
            LRN: student.LRN,
            firstname: student.firstname,
            middlename: student.middlename,
            lastname: student.lastname,
            birthdate: student.birthdate,
            gender: student.gender,
            address: student.address,
        });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this student?")) return;

        try {
            await axios.delete(`/api/students/${id}`);
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get("/api/students");
            setStudents(res.data.students);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (student) => {
        handleEdit(student);
        setShowForm(true);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <Admin>
            <div className="min-h-screen bg-gray-50 p-6">
                <div
                    className={`grid gap-6 ${showForm ? "lg:grid-cols-" : "grid-cols-1"}`}
                >
                    {/* FORM CARD */}
                    <div
                        className={`bg-white p-6 rounded-2xl shadow-sm ${showForm ? "col-span-1" : "hidden"}`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                {editingId
                                    ? "Edit Student Info"
                                    : "Add Student"}
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
                            className="grid grid-cols-1 gap-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="LRN"
                                        value={formData.LRN}
                                        onChange={handleChange}
                                        placeholder="LRN"
                                        className="w-full border rounded-lg p-3"
                                    />
                                    <InputError message={errors.LRN} />
                                </div>
                                <div>
                                    {" "}
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        className="w-full border rounded-lg p-3"
                                    />
                                    <InputError message={errors.firstname} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        name="middlename"
                                        value={formData.middlename}
                                        onChange={handleChange}
                                        placeholder="Middle Name"
                                        className="w-full border rounded-lg p-3"
                                    />
                                    <InputError message={errors.middlename} />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        className="w-full border rounded-lg p-3"
                                    />
                                    <InputError message={errors.lastname} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3"
                                    />
                                    <InputError message={errors.birthdate} />
                                </div>
                                <div>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-3"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <InputError message={errors.gender} />
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    className="bg-blue-500 text-white py-3 rounded-lg w-80"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Create Student"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* TABLE CARD */}
                </div>
                <div
                    className={`bg-white p-6 rounded-2xl shadow-sm overflow-auto ${showForm ? "col-span-2" : "col-span-1"}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Student List
                        </h2>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                            >
                                + Add Student
                            </button>
                        )}
                    </div>

                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b text-gray-500">
                                <th className="py-2">LRN</th>
                                <th>Name</th>
                                <th>Birthdate</th>
                                <th>Gender</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((s) => (
                                    <tr key={s.id} className="border-b">
                                        <td className="py-2">{s.LRN}</td>
                                        <td>
                                            {s.firstname} {s.lastname}
                                        </td>
                                        <td>{s.birthdate}</td>
                                        <td>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    s.gender === "Male"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-pink-100 text-pink-600"
                                                }`}
                                            >
                                                {s.gender}
                                            </span>
                                        </td>
                                        <td className="flex items-start justify-start gap-3 mt-1">
                                            <button
                                                onClick={() =>
                                                    handleEditClick(s)
                                                }
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(s.id)
                                                }
                                                className="bg-red-500
                                                    text-white px-3 py-1
                                                    rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-4 text-gray-400"
                                    >
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Admin>
    );
}
