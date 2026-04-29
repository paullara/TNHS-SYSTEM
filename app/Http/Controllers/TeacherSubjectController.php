<?php

namespace App\Http\Controllers;

use App\Models\TeacherSubject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherSubjectController extends Controller
{
    public function index()
    {
        $teacherSubject = TeacherSubject::with('teacher', 'subject', 'schoolYear')->get();

        return response()->json([
            'teacherSubject' => $teacherSubject,
        ]);
    }

    public function assignTeacherToSubject()
    {
        return Inertia::render('Admin/TeacherSubject/TeacherSubject');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_year_id' => 'required|exists:school_years,id',
        ]);

        $teacherSubject = TeacherSubject::create($validated);

        return response()->json([
            'message' => 'Teacher subject created successfully',
            'data' => $teacherSubject,
        ], 201);
    }

    public function show($id)
    {
        $teacherSubject = TeacherSubject::with('teacher', 'subject')->findOrFail($id);

        if (! $teacherSubject) {
            return response()->json([
                'message' => 'Teacher subject not found',
            ], 404);
        }

        return response()->json($teacherSubject);
    }

    public function update(Request $request, $id)
    {
        $teacherSubject = TeacherSubject::findOrFail($id);

        if (! $teacherSubject) {
            return response()->json([
                'message' => 'Teacher subject not found',
            ], 404);
        }

        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'school_year_id' => 'sometimes|exists:school_years,id',
        ]);

        $teacherSubject->update($validated);

        return response()->json([
            'message' => 'Teacher subject updated successfully',
            'data' => $teacherSubject,
        ]);
    }

    public function destroy($id)
    {
        $teacherSubject = TeacherSubject::findOrFail($id);

        if (! $teacherSubject) {
            return response()->json([
                'message' => 'Teacher subject not found',
            ], 404);
        }

        $teacherSubject->delete();

        return response()->json([
            'message' => 'Teacher subject deleted successfully',
        ]);
    }
}
