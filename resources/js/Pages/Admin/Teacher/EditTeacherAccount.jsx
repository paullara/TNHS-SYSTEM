import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditTeacherAccount({ user }) {
    const [formData, setFormData] = useState({
        username: user.username || "",
        firstname: user.firstname || "",
        middlename: user.middlename || "",
        lastname: user.lastname || "",
        email: user.email || "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log(name, value);
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
            await axios.put(`/api/teachers/${user.id}`, formData);

            alert("Teacher account updated successfully");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head title="Edit Teacher Account" />

            <h2 className="text-xl font-semibold mb-4">Edit Teacher Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="firstname" value="First Name" />
                    <TextInput
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.firstname} />
                </div>

                <div>
                    <InputLabel htmlFor="middlename" value="Middle Name" />
                    <TextInput
                        name="middlename"
                        value={formData.middlename}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.middlename} />
                </div>

                <div>
                    <InputLabel htmlFor="lastname" value="Last Name" />
                    <TextInput
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.lastname} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="mt-4">
                    <PrimaryButton type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Account"}
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
