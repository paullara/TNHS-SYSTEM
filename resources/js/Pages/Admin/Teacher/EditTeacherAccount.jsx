import React from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function EditTeacherAccount({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        username: user.username || "",
        firstname: user.firstname || "",
        middlename: user.middlename || "",
        lastname: user.lastname || "",
        email: user.email || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/teachers/${user.id}`);
    };

    console.log("User:", user);

    return (
        <AdminLayout>
            <h2>Edit Teacher Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        type="text"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>
            </form>
        </AdminLayout>
    );
}
