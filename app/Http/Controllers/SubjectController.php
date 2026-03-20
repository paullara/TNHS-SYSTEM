<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::with('gradeLevel')->get();

        return response()->json([
            'subjects' => $subjects,
        ]);
    }

    public function subjectPage()
    {
        return Inertia::render('Admin/Subject/SubjectPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'grade_level_id' => 'required|exists:grade_levels,id',
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'message' => 'Subject created successfully',
            'data' => $subject,
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::findOrFail($id);

        if (! $subject) {
            return response()->json([
                'message' => 'Subject not found!',
            ], 404);
        }

        return response()->json($subject);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        if (! $subject) {
            return response()->json([
                'message' => 'Subject not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'grade_level_id' => 'sometimes|exists:grade_levels,id',
        ]);

        $subject->update($validated);

        return response()->json([
            'message' => 'Subject updated successfully',
            'data' => $subject,
        ]);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);

        if (! $subject) {
            return response()->json([
                'message' => 'Subject not found',
            ], 404);
        }

        $subject->delete();

        return response()->json([
            'message' => 'Subject deleted successfully',
        ]);
    }
}
