<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $grades = Grade::with('enrollment', 'subject', 'teacher')->get();

        return response()->json($grades);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $authenticatedTeacher = Auth::user();

        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'subject_id' => 'required|exists:subjects,id',
            'q1' => 'nullable|integer|min:0|max:100',
            'q2' => 'nullable|integer|min:0|max:100',
            'q3' => 'nullable|integer|min:0|max:100',
            'q4' => 'nullable|integer|min:0|max:100',
        ]);

        $validated['teacher_id'] = $authenticatedTeacher->id;

        $grade = Grade::create($validated);

        return response()->json([
            'message' => 'Grade created succesfully',
            'data' => $grade,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $grades = Grade::with('enrollment', 'subject', 'teacher')->findOrFail($id);

        if (! $grades) {
            return response()->json([
                'message' => 'Grade not found',
            ], 404);
        }

        return response()->json($grades);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $grade = Grade::findOrFail($id);

        if (! $grade) {
            return response()->json([
                'message' => 'Grade not found',
            ], 404);
        }

        $validated = $request->validate([
            'enrollment_id' => 'sometimes|exists|enrollments,id',
            'subject_id' => 'sometimes|exists|subjects,id',
            'teacher_id' => 'sometimes|exists|users,id',
            'first_sem' => 'sometimes|integer|max:20',
            'second_sem' => 'sometimes|integer|max:20',
            'semester_final_grade' => 'sometimes|integer|max:20',
            'general_average' => 'sometimes|integer|max:20',
        ]);

        $grade->update($validated);

        return response()->json([
            'message' => 'Grade updated successfully',
            'data' => $grade,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $grade = Grade::findOrFail($id);

        if (! $grade) {
            return response()->json([
                'message' => 'Grade not found',
            ], 404);
        }

        $grade->delete();

        return response()->json([
            'message' => 'Grade deleted successfully',
        ]);
    }
}
