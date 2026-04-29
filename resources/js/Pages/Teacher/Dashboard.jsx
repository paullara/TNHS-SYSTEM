import TeacherLayout from "@/Layouts/TeacherLayout";
import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import axios from "axios";

export default function Dashboard({ teacherSubjects }) {
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState({});

    const clean = (val) => (val === "" ? null : Number(val));

    const handleChange = useCallback((id, e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [name]: value,
            },
        }));
    }, []);

    const fetchStudents = async (subjectId, subjectName, semester) => {
        try {
            setLoading(true);

            const res = await axios.get(
                `/teacher/subjects/${subjectId}/students`,
            );

            setStudents(res.data);
            setSelectedSubject(subjectName);
            setSelectedSubjectId(subjectId);
            setSelectedSemester(semester);

            const initial = {};
            res.data.forEach((s) => {
                initial[s.id] = {
                    q1: s.grade?.q1 || "",
                    q2: s.grade?.q2 || "",
                    q3: s.grade?.q3 || "",
                    q4: s.grade?.q4 || "",
                    remedial: s.grade?.remedial || "",
                };
            });

            setFormData(initial);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED GROUPS
    const noGradeStudents = useMemo(
        () => students.filter((s) => !s.grade),
        [students],
    );
    const passedStudents = useMemo(
        () => students.filter((s) => s.grade?.status === "PASSED"),
        [students],
    );
    const failedStudents = useMemo(
        () => students.filter((s) => s.grade?.status === "FAILED"),
        [students],
    );

    const StudentCard = memo(
        ({
            enrollment,
            selectedSubjectId,
            selectedSemester,
            selectedSubject,
            fetchStudents,
            setEditable,
            setErrors,
        }) => {
            const [localData, setLocalData] = useState(
                formData[enrollment.id] || {},
            );

            useEffect(() => {
                setLocalData(formData[enrollment.id] || {});
            }, [formData[enrollment.id]]);

            const handleLocalChange = useCallback((e) => {
                const { name, value } = e.target;
                setLocalData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }, []);

            const handleBlur = useCallback(() => {
                setFormData((prev) => ({
                    ...prev,
                    [enrollment.id]: localData,
                }));
            }, [enrollment.id, localData]);

            const handleSubmit = async (e) => {
                e.preventDefault();

                try {
                    const payload = {
                        enrollment_id: enrollment.id,
                        subject_id: selectedSubjectId,
                        q1: clean(localData.q1),
                        q2: clean(localData.q2),
                        q3: clean(localData.q3),
                        q4: clean(localData.q4),
                        remedial: clean(localData.remedial),
                    };

                    await axios.post("/grades", payload);

                    alert("Saved ✅");

                    // 🔥 REFETCH STUDENTS (AUTO UPDATE UI)
                    fetchStudents(
                        selectedSubjectId,
                        selectedSubject,
                        selectedSemester,
                    );

                    setEditable((prev) => ({
                        ...prev,
                        [enrollment.id]: false,
                    }));
                } catch (err) {
                    if (err.response?.status === 422) {
                        setErrors((prev) => ({
                            ...prev,
                            [enrollment.id]: err.response.data.errors,
                        }));
                    }
                }
            };

            const isLocked =
                enrollment.grade?.is_finalized && !editable[enrollment.id];

            return (
                <div className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800">
                            {enrollment.student?.firstname}{" "}
                            {enrollment.student?.lastname}
                        </p>

                        <span
                            className={`text-xs px-2 py-1 rounded text-white ${
                                enrollment.grade?.status === "PASSED"
                                    ? "bg-green-500"
                                    : enrollment.grade?.status === "FAILED"
                                      ? "bg-red-500"
                                      : "bg-gray-400"
                            }`}
                        >
                            {enrollment.grade?.status || "NO GRADE"}
                        </span>
                    </div>

                    {/* 📘 1ST SEM */}
                    {selectedSemester === "1ST" && (
                        <div>
                            <h4 className="text-blue-600 text-sm font-bold mb-2">
                                1st Semester
                            </h4>

                            <div className="grid grid-cols-2 gap-2">
                                {["q1", "q2"].map((q) => (
                                    <input
                                        key={q}
                                        type="number"
                                        name={q}
                                        placeholder={q.toUpperCase()}
                                        value={localData[q] || ""}
                                        onChange={handleLocalChange}
                                        onBlur={handleBlur}
                                        disabled={isLocked}
                                        className="border p-2 rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 📗 2ND SEM */}
                    {selectedSemester === "2ND" && (
                        <div>
                            <h4 className="text-green-600 text-sm font-bold mb-2">
                                2nd Semester
                            </h4>

                            <div className="grid grid-cols-2 gap-2">
                                {["q3", "q4"].map((q) => (
                                    <input
                                        key={q}
                                        type="number"
                                        name={q}
                                        placeholder={q.toUpperCase()}
                                        value={localData[q] || ""}
                                        onChange={handleLocalChange}
                                        onBlur={handleBlur}
                                        disabled={isLocked}
                                        className="border p-2 rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* REMEDIAL */}
                    {enrollment.grade?.status === "FAILED" && (
                        <input
                            type="number"
                            name="remedial"
                            placeholder="Remedial"
                            value={localData.remedial || ""}
                            onChange={handleLocalChange}
                            onBlur={handleBlur}
                            disabled={isLocked}
                            className="border p-2 rounded bg-yellow-50"
                        />
                    )}

                    {/* SAVE */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLocked}
                        className="w-full bg-green-500 text-white rounded px-3 py-2"
                    >
                        Save
                    </button>

                    {/* FINAL */}
                    {enrollment.grade && (
                        <div className="text-sm text-gray-600">
                            Final Grade: <b>{enrollment.grade.final_grade}</b>
                        </div>
                    )}
                </div>
            );
        },
    );

    return (
        <TeacherLayout
            header={
                <h2 className="text-xl font-semibold">Teacher Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10 max-w-7xl mx-auto space-y-6">
                {/* SUBJECTS */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="font-semibold mb-4">Assigned Subjects</h3>

                    {teacherSubjects.map((item) => (
                        <div
                            key={item.id}
                            className="border p-4 rounded mb-3 flex justify-between"
                        >
                            <div>
                                <p className="font-semibold">
                                    {item.subject?.name}
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
                                        item.subject?.semester,
                                    )
                                }
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                View Students
                            </button>
                        </div>
                    ))}
                </div>

                {/* STUDENTS */}

                {/* 🟡 NO GRADE */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-yellow-600 font-bold mb-4">
                        No Grade Yet ({noGradeStudents.length})
                    </h3>

                    {noGradeStudents.length === 0 ? (
                        <p className="text-gray-500">All students graded</p>
                    ) : (
                        noGradeStudents.map((s) => (
                            <StudentCard
                                key={s.id}
                                enrollment={s}
                                selectedSubjectId={selectedSubjectId}
                                selectedSemester={selectedSemester}
                                selectedSubject={selectedSubject}
                                fetchStudents={fetchStudents}
                                setEditable={setEditable}
                                setErrors={setErrors}
                            />
                        ))
                    )}
                </div>

                {/* 🟢 PASSED */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-green-600 font-bold mb-4">
                        Passed ({passedStudents.length})
                    </h3>

                    {passedStudents.length === 0 ? (
                        <p className="text-gray-500">No passed students</p>
                    ) : (
                        passedStudents.map((s) => (
                            <StudentCard
                                key={s.id}
                                enrollment={s}
                                selectedSubjectId={selectedSubjectId}
                                selectedSemester={selectedSemester}
                                selectedSubject={selectedSubject}
                                fetchStudents={fetchStudents}
                                setEditable={setEditable}
                                setErrors={setErrors}
                            />
                        ))
                    )}
                </div>

                {/* 🔴 FAILED */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-red-600 font-bold mb-4">
                        Failed ({failedStudents.length})
                    </h3>

                    {failedStudents.length === 0 ? (
                        <p className="text-gray-500">No failed students</p>
                    ) : (
                        failedStudents.map((s) => (
                            <StudentCard
                                key={s.id}
                                enrollment={s}
                                selectedSubjectId={selectedSubjectId}
                                selectedSemester={selectedSemester}
                                selectedSubject={selectedSubject}
                                fetchStudents={fetchStudents}
                                setEditable={setEditable}
                                setErrors={setErrors}
                            />
                        ))
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
