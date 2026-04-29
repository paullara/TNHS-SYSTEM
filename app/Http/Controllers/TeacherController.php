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

    public function getStudentsBySubject($subjectId)
    {
        $subject = Subject::findOrFail($subjectId);

        $students = Enrollment::with([
            'student',
            'grade' => function ($q) use ($subjectId) {
                $q->where('subject_id', $subjectId);
            },
        ])
            ->where('section_id', $subject->section_id)
            ->get();

        return response()->json($students);
    }
}
