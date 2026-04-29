import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            height: {
                section_form: "100px",
                student_form: "250px",
                student_info: "80px",
                header: "125px",
            },
            width: {
                first_name: "100px",
                middle_name: "121px",
                birthdate: "400px",
                admission: "300px",
            },
        },
    },

    plugins: [forms],
};
