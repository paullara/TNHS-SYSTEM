import { React, useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function SYList() {
    const [schoolYears, setSchoolYears] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log(name, prev);
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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
        }

        setFormData({
            name: "",
        });

        setEditingId(null);
        fetchSy();
    };

    const handleEdit = (sy) => {
        setEditingId(sy.id);

        setFormData({
            name: sy.name,
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

    useEffect(() => {
        fetchSy();
    });

    return (
        <AdminLayout>
            <div className="h-screen">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        {editingId ? "Edit School Year" : "Create School Year"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4"></form>
                </div>
            </div>
        </AdminLayout>
    );
}
