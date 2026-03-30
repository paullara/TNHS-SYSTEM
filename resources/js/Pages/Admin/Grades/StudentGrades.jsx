import { useState, useEffect } from "react";
import Admin from "@/Layouts/AdminLayout";
import axios from "axios";

export default function StudentGrades() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lrn, setLrn] = useState("");
    const [searching, setSearching] = useState(false);

    const fetchStudentGrades = async (queryLrn = "") => {
        setLoading(true);
        setError(null);

        try {
            const url = queryLrn
                ? `/all-student-grades?lrn=${encodeURIComponent(queryLrn)}`
                : "/all-student-grades";

            const res = await axios.get(url);
            setData(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            if (err.response?.status === 404) {
                setData([]);
                setError("Student not found.");
            } else {
                setError("Failed to fetch student grades.");
            }
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    useEffect(() => {
        fetchStudentGrades();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        fetchStudentGrades(lrn.trim());
    };

    const renderTable = (subjects, label, columns, avg, finalKey) => (
        <>
            <h3 className="font-semibold mt-4 mb-2">{label}</h3>

            <table className="w-full border mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Subject</th>

                        {columns.map((col) => (
                            <th key={col} className="border p-2">
                                {col.toUpperCase()}
                            </th>
                        ))}

                        <th className="border p-2">Sem Final</th>
                    </tr>
                </thead>

                <tbody>
                    {subjects.map((subj, i) => (
                        <tr key={i}>
                            <td className="border p-2">{subj.subject}</td>

                            {columns.map((col) => (
                                <td key={col} className="border p-2">
                                    {subj[col] ?? "-"}
                                </td>
                            ))}

                            <td className="border p-2">
                                {subj[finalKey] ?? "-"}
                            </td>
                        </tr>
                    ))}

                    <tr className="bg-gray-200 font-bold">
                        <td className="border p-2">SEMESTER AVERAGE</td>
                        <td
                            colSpan={columns.length + 1}
                            className="border p-2 text-center"
                        >
                            {avg ?? "-"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );

    if (loading)
        return (
            <Admin>
                <p>Loading...</p>
            </Admin>
        );
    if (error)
        return (
            <Admin>
                <p className="text-red-500">{error}</p>
            </Admin>
        );

    return (
        <Admin>
            {/* SEARCH */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2 items-end">
                <input
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="Enter LRN"
                    className="border rounded px-3 py-2"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                    {searching ? "Searching..." : "Search"}
                </button>
                <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setLrn("");
                        fetchStudentGrades();
                    }}
                >
                    Reset
                </button>
            </form>

            {/* DATA */}
            {data.map((item, index) => (
                <div key={index} className="mb-10">
                    <h2 className="font-bold text-lg">
                        {item.student.name} ({item.student.lrn})
                    </h2>

                    <p>
                        Grade Level:{" "}
                        {item.first_sem.subjects[0]?.grade_level ?? "-"}
                    </p>
                    <p>Section: {item.section?.name ?? "-"}</p>
                    <p>Adviser: {item.section?.adviser?.name ?? "-"}</p>
                    <p>Track/Strand: {item.strand}</p>
                    <p>SY: {item.sy}</p>

                    {/* 1ST SEM */}
                    {item.first_sem.subjects.length > 0 &&
                        renderTable(
                            item.first_sem.subjects,
                            "1st Semester",
                            ["q1", "q2"],
                            item.first_sem.average,
                            "first_sem_final",
                        )}

                    {/* 2ND SEM */}
                    {item.second_sem.subjects.length > 0 &&
                        renderTable(
                            item.second_sem.subjects,
                            "2nd Semester",
                            ["q3", "q4"],
                            item.second_sem.average,
                            "second_sem_final",
                        )}
                </div>
            ))}
        </Admin>
    );
}
