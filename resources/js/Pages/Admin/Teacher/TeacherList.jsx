import AdminLayout from "@/Layouts/AdminLayout";
import { React, useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";

export default function TeacherList() {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const res = await axios.get("/api/teachers");
                setTeachers(res.data.teachers);
            } catch (error) {
                console.error("Error fetching teachers data.");
            }
        };
        fetchTeachers();
    }, []);
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this teacher?")) return;

        try {
            await axios.delete(`/api/teachers/${id}`);

            alert("Teacher deleted successfully");

            router.visit("/teachers");
        } catch (error) {
            console.error("Delete failed", error);
        }
    };
    return (
        <AdminLayout>
            <Head title="Teacher" />
            <div className="py-4 max-w-7xl mx-auto px-4">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <table className="w-full table-auto divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    First Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Middle Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Last Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {teachers.map((teacher) => (
                                <tr key={teacher.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.firstname}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.middlename}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.lastname}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {teacher.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <Link
                                            href={`/teachers/edit/${teacher.id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(teacher.id)
                                            }
                                            className="text-red-500 hover:text-red-800"
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
        </AdminLayout>
    );
}
