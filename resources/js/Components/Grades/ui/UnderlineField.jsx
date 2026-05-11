export default function UnderlineField({ label, value, width = "w-full" }) {
    return (
        <div className={`flex items-end gap-1 ${width}`}>
            <span className="leading-none whitespace-nowrap">{label}</span>

            <span className="flex-1 border-b border-black text-center font-semibold leading-none">
                {value || "-"}
            </span>
        </div>
    );
}
