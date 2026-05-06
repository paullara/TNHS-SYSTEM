import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Menu,
    Bell,
    MessageCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import axios from "axios";

export default function InstructorLayout({ header, children }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ✅ Notification State
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(url.startsWith("/teachers"));
    const [loading, setLoading] = useState(false);

    // const fetchNotifications = async () => {
    //     setLoading(true);
    //     try {
    //         const res = await axios.get("/notifications");
    //         setNotifications(
    //             Array.isArray(res.data.notifications)
    //                 ? res.data.notifications
    //                 : [],
    //         );
    //     } catch (err) {
    //         setNotifications([]);
    //     }
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     fetchNotifications();
    // }, []);

    // const markAsRead = async (id) => {
    //     try {
    //         await axios.post(`/notifications/${id}/read`);
    //         fetchNotifications();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <div className="h-screen flex bg-white p-2 gap-2">
            {/* Sidebar */}
            <aside className="bg-gray-50 w-38 flex flex-col h-screen rounded-md">
                {/* Logo */}
                <div className="flex items-center justify-start mb-6 p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/logo/LOGO.png"
                            alt="Logo"
                            className="h-15 w-12"
                        />
                        <h1 className="text-4xl font-medium tracking-wide bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
                            TNHS
                        </h1>
                    </Link>
                </div>

                {/* Nav links (scrollable area) */}
                <div className="flex-1 overflow-y-auto px-6">
                    <Link
                        href={route("admin.dashboard")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Dashboard
                        </h1>
                    </Link>
                    <div className="mb-6">
                        {/* Header with toggle */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center justify-between w-full text-left mb-2"
                        >
                            <h1 className="text-black text-lg font-medium">
                                Teachers
                            </h1>

                            <span className="text-gray-500 text-sm">
                                {open ? (
                                    <ChevronUp className="h-4" />
                                ) : (
                                    <ChevronDown className="h-4" />
                                )}
                            </span>
                        </button>

                        {/* Collapsible links */}
                        {open && (
                            <div className="flex flex-col gap-1 ml-3 pl-3 border-l">
                                <Link
                                    href={route("teachers.list")}
                                    className={`text-lg ${
                                        url.startsWith("/teachers") &&
                                        !url.startsWith("/teachers/pds")
                                            ? "text-blue-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    All Teachers
                                </Link>

                                <Link
                                    href={route("teachers.list")}
                                    className={`text-lg ${
                                        url.startsWith("/teachers/pds")
                                            ? "text-blue-600"
                                            : "text-gray-700"
                                    }`}
                                >
                                    Teachers PDS
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* <Link
                        href={route("teachers.create")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Teachers Create
                        </h1>
                    </Link> */}
                    <Link
                        href={route("student.create")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Students
                        </h1>
                    </Link>
                    <Link
                        href={route("section.list")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Section
                        </h1>
                    </Link>
                    <Link
                        href={route("sy.list")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            School Year
                        </h1>
                    </Link>
                    <Link
                        href={route("gradelevel.page")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Grade Level
                        </h1>
                    </Link>
                    <Link
                        href={route("subject.page")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Subject
                        </h1>
                    </Link>
                    <Link
                        href={route("assign-subject")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Subject Assignment
                        </h1>
                    </Link>
                    <Link
                        href={route("enrollment.create")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Enrollment
                        </h1>
                    </Link>

                    <Link
                        href={route("grade")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Grade
                        </h1>
                    </Link>
                    <Link
                        href={route("test.grade")}
                        className="flex items-center gap-2 mb-6"
                    >
                        <h1 className="text-black text-lg font-medium">
                            Test Grade
                        </h1>
                    </Link>

                    <Link></Link>
                </div>

                {/* Sticky Profile + Logout (sticks to sidebar bottom) */}
                <div className="sticky bottom-0 bg-gray-50 p-4">
                    <NavLink
                        href={route("profile.edit")}
                        className="w-full px-3 py-2 rounded-md text-sm font-medium text-lg"
                    >
                        <h1 className="text-lg">Profile</h1>
                    </NavLink>
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full px-3 py-2 text-left rounded-md text-sm font-medium text-black hover:text-red-800 "
                    >
                        <h1 className="text-lg">Log Out</h1>
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col gap-2">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-50 rounded-md ">
                    <div className="flex items-center p-6">
                        {route().current("admin.dashboard") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Dashboard
                            </h1>
                        )}
                        {route().current("teachers.list") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                All Teachers
                            </h1>
                        )}
                        {route().current("teachers.create") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Register Teacher
                            </h1>
                        )}
                        {route().current("section.list") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                All Sections
                            </h1>
                        )}
                        {route().current("sy.list") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                School Year List
                            </h1>
                        )}
                        {route().current("gradelevel.page") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Grade Level List
                            </h1>
                        )}
                        {route().current("subject.page") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Subject List
                            </h1>
                        )}
                        {route().current("student.create") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Manage Student
                            </h1>
                        )}
                        {route().current("assign-subject") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Assign Subject to Teacher
                            </h1>
                        )}
                        {route().current("enrollment.create") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Manage Enrollment
                            </h1>
                        )}
                        {route().current("grade") && (
                            <h1 className="text-xl font-semibold tracking-wide">
                                Student Academic Record Retrieval
                            </h1>
                        )}
                    </div>
                    <header className="bg-gray-50 h-16 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                className="md:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>

                            {/* {header && (
                                <h2 className="text-lg font-semibold text-gray-700">
                                    {header}
                                </h2>
                            )} */}
                        </div>
                        <div className="relative flex flex-row items-center gap-4">
                            {/* Notification Icon */}
                            <button
                                className="relative p-2 rounded-full hover:bg-gray-100"
                                onClick={() => setNotifOpen(true)}
                            >
                                <Bell className="w-5 h-5 text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            {/* Message Icon */}
                            {/* <Link href={route("instructor.groups.index")}>
                                <button className="relative p-2 rounded-full hover:bg-gray-100">
                                    <MessageCircle className="w-5 h-5 text-gray-700" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                                </button>
                            </Link> */}
                            {/* Profile + Dropdown */}
                            <div className="relative flex flex-row items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md">
                                            {auth?.user?.profile_picture ? (
                                                <img
                                                    src={`/${auth.user.profile_picture}`}
                                                    alt="Profile"
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-semibold text-lg">
                                                    {auth?.user?.firstname
                                                        ? auth.user.firstname
                                                              .charAt(0)
                                                              .toUpperCase()
                                                        : "U"}
                                                </div>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>
                                </Dropdown>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Scrollable children */}
                <main className="flex-1 overflow-y-auto p-2 bg-gray-50 rounded-md">
                    {children}
                </main>

                {/* ✅ Notification Drawer */}
                {/* {notifOpen && (
                    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l shadow-xl p-6 overflow-y-auto z-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                Notifications
                            </h2>
                            <button
                                className="text-gray-500 hover:text-black"
                                onClick={() => setNotifOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {loading && <p className="text-gray-500">Loading...</p>}
                        {!loading && notifications.length === 0 && (
                            <p className="text-gray-500">No notifications.</p>
                        )}

                        <div className="space-y-4">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 rounded-xl border ${
                                        n.read_at
                                            ? "bg-gray-100 border-gray-200"
                                            : "bg-purple-50 border-purple-300"
                                    }`}
                                >
                                    <p className="font-medium">
                                        {n.data.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {n.created_at}
                                    </p>

                                    {!n.read_at && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="text-purple-600 text-sm font-semibold mt-2"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}
            </div>
        </div>
    );
}
