<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $enrollments = Enrollment::with('student', 'schoolYear', 'gradeLevel', 'section', 'grade')->get();

        return response()->json([
            'enrollments' => $enrollments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Enrollment/Enrollment');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'school_year_id' => 'required|exists:school_years,id',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'section_id' => 'required|exists:sections,id',
        ]);

        $enrollment = Enrollment::create($validated);

        return response()->json([
            'message' => 'Enrollment created successfully.',
            'data' => $enrollment,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $enrollment = Enrollment::with('student', 'schoolYear', 'gradeLevel', 'section')->findOrFail($id);

        if (! $enrollment) {
            return response()->json([
                'message' => 'Enrollment not found',
            ], 404);
        }

        return response()->json($enrollment);
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
        $enrollment = Enrollment::findOrFail($id);

        if (! $enrollment) {
            return response()->json([
                'message' => 'Enrollment not found',
            ], 404);
        }

        $validated = $request->validate([
            'student_id' => 'sometimes|exists|students,id',
            'school_year_id' => 'sometimes|exists|school_years,id',
            'grade_level_id' => 'sometimes|exists|grade_levels,id',
            'section_id' => 'sometimes|exists|sections,id',
        ]);

        $enrollment->update($validated);

        return response()->json([
            'message' => 'Enrollment updated successfully',
            'data' => $enrollment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $enrollment = Enrollment::findOrFail($id);

        if (! $enrollment) {
            return response()->json([
                'message' => 'Enrollment not found',
            ], 404);
        }

        $enrollment->delete();

        return response()->json([
            'message' => 'Enrollment successfully deleted',
        ]);
    }
}
