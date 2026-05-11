import UnderlineField from "./ui/UnderlineField";

export default function SemesterHeader({ item, semesterLabel }) {
    return (
        <div className="mb-2 text-[13px] mt-6 space-y-2">
            <div className="flex gap-4">
                <UnderlineField
                    label="School:"
                    value="TAMAYO NATIONAL HIGH SCHOOL"
                />

                <UnderlineField label="School ID:" value="300389" />

                <UnderlineField
                    label="GRADE LEVEL:"
                    value={item?.grade_level}
                />

                <UnderlineField label="SY:" value={item?.sy} />

                <UnderlineField label="SEM:" value={semesterLabel} />
            </div>

            <div className="flex gap-4">
                <UnderlineField
                    label="TRACK/STRAND:"
                    value={`Academic Track/${item?.strand}`}
                />

                <UnderlineField label="SECTION:" value={item?.section?.name} />
            </div>
        </div>
    );
}
