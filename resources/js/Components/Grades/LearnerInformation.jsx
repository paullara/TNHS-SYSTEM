import SectionTitle from "./SectionTitle";

export default function LearnerInformation({ data }) {
    const student = data?.student;

    return (
        <>
            <SectionTitle title="LEARNERS INFORMATION" />

            <div className="w-full text-[13px] mt-1 space-y-1">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-[60px]">LAST NAME:</span>
                    <span className="flex-1 border-b border-black text-center font-semibold">
                        {student?.name?.split(" ")[2]?.toUpperCase()}
                    </span>

                    <span className="w-[60px]">FIRST NAME:</span>
                    <span className="flex-1 border-b border-black text-center font-semibold">
                        {student?.name?.split(" ")[0]?.toUpperCase()}
                    </span>

                    <span className="w-[70px]">MIDDLE NAME:</span>
                    <span className="flex-1 border-b border-black text-center font-semibold">
                        {student?.name?.split(" ")[1]?.toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="w-[18px]">LRN:</span>
                    <span className="w-[300px] border-b border-black text-center font-semibold">
                        {student?.lrn}
                    </span>

                    <span className="w-[168px]">
                        Date of Birth (MM/DD/YYYY):
                    </span>

                    <span className="w-[300px] border-b border-black text-center font-semibold">
                        {student?.date_of_birth
                            ? new Date(
                                  student.date_of_birth,
                              ).toLocaleDateString()
                            : "-"}
                    </span>
                </div>
            </div>
        </>
    );
}
