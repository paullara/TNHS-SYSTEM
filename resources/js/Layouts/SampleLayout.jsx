import ApplicationLogo from "@/Components/ApplicationLogo";
import DropDown from "@/Components/DropDown";
import { Link, usePage } from "@inertiajs/react";

export default function SampleLayout({ header, children }) {
    const { auth } = usePage().props;

    return <div className="bg-white min-h-screen">{children}</div>;
}
