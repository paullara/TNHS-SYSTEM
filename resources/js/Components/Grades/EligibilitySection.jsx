import SectionTitle from "./SectionTitle";

export default function EligibilitySection() {
    return (
        <>
            <SectionTitle title="ELIGIBILITY FOR SHS ENROLLMENT" />

            <div className="w-full text-[13px] mt-3">
                <div className="flex items-center gap-3">
                    <input type="checkbox" />
                    <span>High School Completer</span>
                </div>
            </div>
        </>
    );
}
