import { useState, useEffect } from "react";
import Admin from "@/Layouts/AdminLayout";
import axios from "axios";

export default function StudentGrades() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lrn, setLrn] = useState("");
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

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
            const url = `/all-student-grades?lrn=${encodeURIComponent(queryLrn)}`;
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
        // don't fetch anything on load
    }, []);

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
                        <th className="border p-2">Action Taken</th>
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
                            <td className="border p-2">
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
            <form
                onSubmit={handleSearch}
                className="mb-6 flex gap-2 items-end no-print"
            >
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
                    className="bg-gray-500 text-white px-4 py-2 rounded no-print"
                    onClick={() => {
                        setLrn("");
                        setHasSearched(false);
                        setData([]);
                        setError(null);
                    }}
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-green-600 text-white px-4 py-2 rounded no-print"
                >
                    Print Grades
                </button>
            </form>

            {/* DATA */}
            <div className="printable">
                {!hasSearched && (
                    <p>Please search a student LRN to display grade data.</p>
                )}
                {hasSearched && data.length === 0 && !loading && !error && (
                    <p>No grades found for this LRN.</p>
                )}

                {data.length > 0 &&
                    data.map((item, index) => (
                        <div key={index} className="mb-10">
                            {/* HEADER */}
                            <div className="w-full h-header flex flex-row">
                                <div className="w-1/3 h-full flex items-center justify-center">
                                    <img
                                        src="logo/deoo.png"
                                        className="h-30 w-28"
                                    />
                                </div>
                                <div className="w-1/2 h-full flex flex-col items-center justify-center">
                                    <h1>REPUBLIC OF THE PHILIPPINES</h1>
                                    <h1>DEPARTMENT OF THE EDUCTATION</h1>
                                    <h1 className="font-bold mt-5">
                                        SENIOR HIGH SCHOOL STUDENT PERMANENT
                                        RECORD
                                    </h1>
                                </div>
                                <div className="w-1/3 h-full flex items-center justify-center">
                                    <img
                                        src="logo/deped.png"
                                        className="h-30 w-28"
                                    />
                                </div>
                            </div>

                            {/* LEARNER INFO */}
                            <div className="w-full h-10 bg-gray-400 flex items-center justify-center">
                                <h1 className="text-md font-semibold">
                                    LEARNERS INFORMATION
                                </h1>
                            </div>

                            <div className="w-full h-student_info flex flex-col">
                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div>
                                        LAST NAME:{" "}
                                        <span className="underline">SALES</span>
                                    </div>
                                    <div>
                                        FIRST NAME:{" "}
                                        <span className="underline">
                                            JOHN PAUL
                                        </span>
                                    </div>
                                    <div>
                                        MIDDLE NAME:{" "}
                                        <span className="underline">LARA</span>
                                    </div>
                                </div>
                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div>
                                        LRN:{" "}
                                        <span className="underline">
                                            101010101
                                        </span>
                                    </div>
                                    <div>
                                        DATE OF BIRHT (MM/DD/YYYY):{" "}
                                        <span className="underline">
                                            06/12/2002
                                        </span>
                                    </div>
                                    <div>
                                        SEX:{" "}
                                        <span className="underline">MALE</span>
                                    </div>
                                    <div>
                                        Date of SHS Admission(MM/DD/YYYY):{" "}
                                        <span className="underline">
                                            06/04/2026
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ELIGIBILITY FOR SHS ENROLLMENT */}
                            <div className="w-full h-10 bg-gray-400 flex items-center justify-center mt-4">
                                <h1 className="text-md font-semibold">
                                    ELIGIBILITY FOR SHS ENROLLMENT
                                </h1>
                            </div>

                            <div className="w-full h-student_info flex flex-col mb-28">
                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div>
                                        <input type="checkbox" /> High School
                                        Completer*
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Gen Ave.</span>
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <input type="checkbox" /> Junior High
                                        School Completer*
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Gen Ave.</span>
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div className="flex items-center gap-2">
                                        Date of Graduation/Completion
                                        (MM/DD/YYYY):
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        Name of School:{" "}
                                        <span className="underline">
                                            TAMAYO NATIONAL HIGH SCHOOL
                                        </span>
                                    </div>
                                    <div>
                                        School Address:{" "}
                                        <span className="underline">
                                            TAMAYO, SAN CARLOS CITY, PANGASINAN
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div>
                                        <input type="checkbox" /> PEPT Passer*
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Rating:</span>
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <input type="checkbox" /> ALS A&E
                                        Passer*
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>Rating:</span>
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <input type="checkbox" /> Others (Pls.
                                        Specify)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="w-full h-1/2 flex flex-row justify-between p-5">
                                    <div>
                                        <h1 className="text-xs italic">
                                            *High School Completers are students
                                            who graduated from secondary school
                                            under the old curriculum
                                        </h1>
                                        <h1 className="text-xs italic">
                                            **PEPT-Philippines Educational
                                            Placement Test for JHS
                                        </h1>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs">
                                                Name Address of Community
                                                Learning Center
                                            </span>
                                            <input
                                                type="text"
                                                className="border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                        <h1 className="text-xs">
                                            ***ALS A&E- Alternative Learning
                                            System Accreditation and Equivalency
                                            Test for JHS
                                        </h1>
                                    </div>
                                </div>
                            </div>

                            {/* SEMESTER TABLES */}
                            {item.first_sem.subjects.length > 0 &&
                                renderTable(
                                    item.first_sem.subjects,
                                    "1st Semester",
                                    ["q1", "q2"],
                                    item.first_sem.average,
                                    "first_sem_final",
                                )}
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
            </div>
        </Admin>
    );
}
