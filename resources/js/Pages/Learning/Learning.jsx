import { useState, useEffect } from "react";
import Admin from "@/Layouts/AdminLayout";
import axios from "axios";

export default function Learning() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lrn, setLrn] = useState("");
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [formData, setFormData] = useState({
        lrn: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchStudentGrades = async (queryLrn = "") => {
        if (!queryLrn) {
            setData([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `/students-grade?lrn=${encodeURIComponent(queryLrn)}`;
            const res = await axios.get(url);

            setData(Array.isArray(res.data) ? res.data : []);
            console.log("Data", res.data);
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

    const handlePrint = () => {
        if (typeof window !== "undefined" && window.print) {
            window.print();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearching(true);
        setHasSearched(true);
        fetchStudentGrades(lrn.trim());
    };

    const renderTable = (subjects, label, columns, avg, finalKey) => (
        <>
            <h3>{label}</h3>
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
                        <th className="border p-2">Action Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((subj, i) => (
                        <tr key={i}>
                            <td>{subj.subject}</td>
                            {columns.map((col) => (
                                <td key={col} className="border p-2">
                                    {subj[col] ?? "-"}
                                </td>
                            ))}
                            <td className="border p-2">
                                {subj[finalKey] ?? "-"}
                            </td>
                            <td className="border p-2 flex items-center">
                                {subj[finalKey] != null
                                    ? subj[finalKey] >= 75
                                        ? "Passed"
                                        : "Failed"
                                    : "-"}
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
                        <td
                            colSpan={columns.length + 1}
                            className="border p-2 text-center"
                        >
                            Passed
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
            <form
                onSubmit={handleSearch}
                className="mb-6 flex gap-2 items-end no-print"
            >
                <input
                    type="text"
                    name="lrn"
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="Enter LRN"
                    className="border rounded px-3 py-2"
                />
                <button>{searching ? "Searching" : "Search"}</button>
                <button
                    type="button"
                    onClick={() => {
                        setLrn("");
                        setHasSearched(false);
                        setData([]);
                        setError(null);
                    }}
                >
                    Reset
                </button>
                <button type="button" onClick={handlePrint}>
                    Print Grades
                </button>
            </form>

            <div className="printable">
                {!hasSearched && (
                    <p>Please search a student LRN to display grade data.</p>
                )}
                {hasSearched && data.length === 0 && !loading && !error && (
                    <p>No grades found for this LRN.</p>
                )}
                {data.length > 0 &&
                    data.map((item, index) => (
                        <div key={index} className="mb-8">
                            <div className="mb-4">
                                <p>
                                    <strong>Name:</strong> {item.student.name}
                                </p>
                                <p>
                                    <strong>LRN:</strong> {item.student.lrn}
                                </p>
                                <p>
                                    <strong>Grade Level:</strong>{" "}
                                    {item.grade_level ?? "N/A"}
                                </p>
                                <p>
                                    <strong>Section:</strong>{" "}
                                    {item.section.name ?? "N/A"}
                                </p>
                                <p>
                                    <strong>Adviser:</strong>{" "}
                                    {item.section.adviser ?? "N/A"}
                                </p>
                            </div>

                            {item.first_sem.subjects.length > 0 &&
                                renderTable(
                                    item.first_sem.subjects,
                                    "1st Semester",
                                    ["q1", "q2"],
                                    item.first_sem.average,
                                    "first_sem_final",
                                )}
                        </div>
                    ))}
            </div>
        </Admin>
    );
}
