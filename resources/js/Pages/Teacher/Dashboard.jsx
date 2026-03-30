import TeacherLayout from "@/Layouts/TeacherLayout";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function Dashboard({ teacherSubjects }) {
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ per-student form state
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    // ✅ clean value (important for nullable integers)
    const clean = (val) => (val === "" ? null : Number(val));

    // ✅ handle input per student
    const handleChange = (enrollmentId, e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [enrollmentId]: {
                ...prev[enrollmentId],
                [name]: value,
            },
        }));
    };

    // ✅ submit per student
    const handleSubmit = async (e, enrollmentId) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/grades", {
                enrollment_id: enrollmentId,
                subject_id: selectedSubjectId, // ✅ FIXED
                q1: clean(formData[enrollmentId]?.q1),
                q2: clean(formData[enrollmentId]?.q2),
                q3: clean(formData[enrollmentId]?.q3),
                q4: clean(formData[enrollmentId]?.q4),
            });

            alert("Student graded successfully ✅");

            // reset only this student
            setFormData((prev) => ({
                ...prev,
                [enrollmentId]: {
                    q1: "",
                    q2: "",
                    q3: "",
                    q4: "",
                },
            }));

            setErrors({});
        } catch (err) {
            if (err.response?.status === 422) {
                console.log("VALIDATION ERRORS:", err.response.data);

                setErrors((prev) => ({
                    ...prev,
                    [enrollmentId]: err.response.data.errors,
                }));
            } else {
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ fetch students
    const fetchStudents = async (subjectId, subjectName) => {
        try {
            setLoading(true);

            const res = await axios.get(
                `/teacher/subjects/${subjectId}/students`,
            );

            setStudents(res.data);
            setSelectedSubject(subjectName);
            setSelectedSubjectId(subjectId); // ✅ VERY IMPORTANT

            // initialize form per student
            const initialForm = {};
            res.data.forEach((enrollment) => {
                initialForm[enrollment.id] = {
                    q1: "",
                    q2: "",
                    q3: "",
                    q4: "",
                };
            });

            setFormData(initialForm);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TeacherLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Teacher Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10 max-w-7xl mx-auto space-y-6">
                {/* SUBJECTS */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Assigned Subjects
                    </h3>

                    {teacherSubjects.length === 0 ? (
                        <p>No subjects assigned.</p>
                    ) : (
                        teacherSubjects.map((item) => (
                            <div
                                key={item.id}
                                className="border p-4 rounded-lg mb-3 flex justify-between"
                            >
                                <div>
                                    <p>
                                        <b>{item.subject?.name}</b>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {item.school_year?.label}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        fetchStudents(
                                            item.subject_id,
                                            item.subject?.name,
                                        )
                                    }
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    View Students
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* STUDENTS */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Students {selectedSubject && `- ${selectedSubject}`}
                    </h3>

                    {loading ? (
                        <p>Loading...</p>
                    ) : students.length === 0 ? (
                        <p>No students.</p>
                    ) : (
                        students.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="border p-4 rounded-lg mb-4"
                            >
                                <p className="font-semibold mb-2">
                                    {enrollment.student?.firstname}{" "}
                                    {enrollment.student?.lastname}
                                </p>

                                <form
                                    onSubmit={(e) =>
                                        handleSubmit(e, enrollment.id)
                                    }
                                    className="grid grid-cols-2 md:grid-cols-5 gap-3"
                                >
                                    {/* Q1 */}
                                    <input
                                        type="number"
                                        name="q1"
                                        placeholder="Q1"
                                        value={
                                            formData[enrollment.id]?.q1 || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(enrollment.id, e)
                                        }
                                        className="border p-2 rounded"
                                    />
                                    <InputError
                                        message={errors[enrollment.id]?.q1?.[0]}
                                    />

                                    {/* Q2 */}
                                    <input
                                        type="number"
                                        name="q2"
                                        placeholder="Q2"
                                        value={
                                            formData[enrollment.id]?.q2 || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(enrollment.id, e)
                                        }
                                        className="border p-2 rounded"
                                    />
                                    <InputError
                                        message={errors[enrollment.id]?.q2?.[0]}
                                    />

                                    {/* Q3 */}
                                    <input
                                        type="number"
                                        name="q3"
                                        placeholder="Q3"
                                        value={
                                            formData[enrollment.id]?.q3 || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(enrollment.id, e)
                                        }
                                        className="border p-2 rounded"
                                    />
                                    <InputError
                                        message={errors[enrollment.id]?.q3?.[0]}
                                    />

                                    {/* Q4 */}
                                    <input
                                        type="number"
                                        name="q4"
                                        placeholder="Q4"
                                        value={
                                            formData[enrollment.id]?.q4 || ""
                                        }
                                        onChange={(e) =>
                                            handleChange(enrollment.id, e)
                                        }
                                        className="border p-2 rounded"
                                    />
                                    <InputError
                                        message={errors[enrollment.id]?.q4?.[0]}
                                    />

                                    {/* BUTTON */}
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white rounded px-4 py-2 col-span-2 md:col-span-1"
                                    >
                                        Save
                                    </button>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
