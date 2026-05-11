export default function GradeTable({
    subjects,
    label,
    columns,
    avg,
    finalKey,
    adviser,
}) {
    const allSubjectsPassed = subjects.every(
        (subj) => subj[finalKey] != null && subj[finalKey] >= 75,
    );

    const semesterStatus = allSubjectsPassed ? "PASSED" : "FAILED";

    return (
        <>
            <table className="w-full border mb-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th rowSpan="2" className="border p-2">
                            SUBJECT TYPE
                        </th>

                        <th rowSpan="2" className="border p-2">
                            SUBJECTS
                        </th>

                        <th colSpan={columns.length} className="border p-2">
                            QUARTER
                        </th>

                        <th rowSpan="2" className="border p-2">
                            FINAL
                        </th>

                        <th rowSpan="2" className="border p-2">
                            ACTION
                        </th>
                    </tr>

                    <tr className="bg-gray-100">
                        {columns.map((col) => (
                            <th key={col} className="border p-2">
                                {col.toUpperCase()}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {subjects.map((subj, i) => (
                        <tr key={i}>
                            <td className="border p-2 text-center">
                                {subj.subject_indicate}
                            </td>

                            <td className="border p-2">{subj.subject}</td>

                            {columns.map((col) => (
                                <td
                                    key={col}
                                    className="border p-2 text-center"
                                >
                                    {subj[col] ?? "-"}
                                </td>
                            ))}

                            <td className="border p-2 text-center">
                                {subj[finalKey] ?? "-"}
                            </td>

                            <td className="border p-2 text-center">
                                {subj[finalKey] >= 75 ? "Passed" : "Failed"}
                            </td>
                        </tr>
                    ))}

                    <tr className="font-bold">
                        <td
                            colSpan={2 + columns.length}
                            className="border p-2 text-right bg-gray-200"
                        >
                            General Ave. for the Semester:
                        </td>
                        <td className="border p-2 text-center">{avg}</td>

                        <td className="border p-2 text-center">
                            {semesterStatus}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-5 text-[13px]">
                <span className="font-semibold">Prepared by:</span>

                <div className="border-b border-black w-[300px] text-center font-semibold mt-5">
                    {adviser || "-"}
                </div>

                <p>Signature of Adviser over Printed Name</p>
            </div>
        </>
    );
}
