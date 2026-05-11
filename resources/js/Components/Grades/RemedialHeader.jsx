export default function RemedialTable({ subjects = [], finalKey }) {
    const failedSubjects = subjects.filter(
        (subj) => subj?.[finalKey] != null && subj?.[finalKey] < 75,
    );

    return (
        <table className="w-full border mb-4">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">SUBJECT</th>

                    <th className="border p-2">FINAL GRADE</th>

                    <th className="border p-2">ACTION</th>
                </tr>
            </thead>

            <tbody>
                {failedSubjects.length > 0 ? (
                    failedSubjects.map((subj, i) => (
                        <tr key={i}>
                            <td className="border p-2">{subj.subject}</td>

                            <td className="border p-2 text-center">
                                {subj[finalKey]}
                            </td>

                            <td className="border p-2 text-center">Failed</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="border p-2 text-center">
                            No remedial subjects
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
