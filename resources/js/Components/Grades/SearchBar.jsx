export default function SearchBar({
    lrn,
    setLrn,
    handleSearch,
    searching,
    handlePrint,
    onReset,
}) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                handleSearch(formData.get("lrn"));
            }}
            className="mb-2 flex gap-2 justify-end items-end no-print w-full"
        >
            <input
                name="lrn"
                value={lrn}
                onChange={(e) => setLrn(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter LRN"
                className="border rounded px-3 py-2"
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                {searching ? "Searching..." : "Search"}
            </button>

            <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={onReset}
            >
                Reset
            </button>

            <button
                type="button"
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Print Grades
            </button>
        </form>
    );
}
