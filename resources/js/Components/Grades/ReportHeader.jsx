export default function ReportHeader() {
    return (
        <div className="w-full h-header flex flex-row">
            <div className="w-1/3 flex items-center justify-center">
                <img src="/logo/deoo.png" className="h-30 w-28" />
            </div>

            <div className="w-1/2 flex flex-col items-center justify-center">
                <h1>REPUBLIC OF THE PHILIPPINES</h1>
                <h1>DEPARTMENT OF EDUCATION</h1>
                <h1 className="font-bold mt-4 text-lg text-center">
                    SENIOR HIGH SCHOOL STUDENT PERMANENT RECORD
                </h1>
            </div>

            <div className="w-1/3 flex items-center justify-center">
                <img src="/logo/deped.png" className="h-30 w-28" />
            </div>
        </div>
    );
}
