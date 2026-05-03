import AdminLayout from "@/Layouts/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import InputError from "@/Components/InputError";

export default function CreateTeacherAccount() {
    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            await axios.post("/api/teachers", formData);

            router.visit("/teachers");
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
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-semibold mb-6 text-gray-600">
                    Create Teacher Account
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="Username"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="First Name"
                        />
                        <InputError message={errors.firstname} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            name="middlename"
                            value={formData.middlename}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="Optional"
                        />
                        <InputError message={errors.middlename} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="Last Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="Email"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border w-full rounded-md p-3"
                            placeholder="Password"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="border rounded-md p-3 w-full"
                            placeholder="Password confirmation"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            onSubmit={handleSubmit}
                            className="w-80  h-10 bg-blue-800 hover:bg-blue-900 border rounded-md text-white"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
