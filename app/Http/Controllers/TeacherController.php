<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Subject;
use App\Models\TeacherSubject;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function dashboard()
    {
        $teacherSubjects = TeacherSubject::with(['subject', 'schoolYear'])
            ->where('teacher_id', Auth::id())
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'teacherSubjects' => $teacherSubjects,
        ]);
    }

    public function getStudentsBySubject(Subject $subject)
    {
        $students = Enrollment::with([
            'student',
            'grade' => function ($q) use ($subject) {
                $q->where('subject_id', $subject->id);
            },
        ])
            ->where('section_id', $subject->section_id)
            ->get();

        return response()->json($students);
    }
}
