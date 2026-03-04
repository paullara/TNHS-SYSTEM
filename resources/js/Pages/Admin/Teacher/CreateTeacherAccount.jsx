import { React, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function CreateTeacherAccount() {
    const { data, setData, post, processing, errors, reset } = useForm({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
        username: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("teachers.store"), {
            onSuccess: () => reset(),
        });
    };
    return (
        <AdminLayout>
            <Head title="Create Account" />

            <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
                <h2 className="text-lg font-semibold">
                    Create Teacher Account
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.username}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="firstname" value="Firstname" />
                        <TextInput
                            id="firstname"
                            type="text"
                            value={data.firstname}
                            onChange={(e) =>
                                setData("firstname", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.firstname}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="middlename" value="Middle Name" />
                        <TextInput
                            id="middlename"
                            type="text"
                            value={data.middlename}
                            placeholder="Optional"
                            onChange={(e) =>
                                setData("middlename", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.middlename}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="lastname" value="Last Name" />

                        <TextInput
                            id="lastname"
                            type="text"
                            value={data.lastname}
                            onChange={(e) =>
                                setData("lastname", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />

                        <InputError
                            message={errors.lastname}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Password Confirmation"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="mt-1 w-full block"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />

                        <div className="col-span-1 md:col-span-2 mt-4">
                            <PrimaryButton disabled={processing}>
                                Create Account
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
