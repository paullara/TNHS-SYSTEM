<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    private function computeGrade($data)
    {
        $quarters = collect([
            $data['q1'] ?? null,
            $data['q2'] ?? null,
            $data['q3'] ?? null,
            $data['q4'] ?? null,
        ])->filter();

        $average = $quarters->count() ? $quarters->avg() : 0;

        $final = $average;
        $status = $average >= 75 ? 'PASSED' : 'FAILED';

        if (! empty($data['remedial'])) {
            $final = ($average + $data['remedial']) / 2;
            $status = $final >= 75 ? 'PASSED' : 'FAILED';
        }

        return [
            'final_grade' => round($final, 2),
            'status' => $status,
        ];
    }

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
            'remedial' => 'nullable|integer|min:0|max:100',
        ]);

        $validated['teacher_id'] = $authenticatedTeacher->id;

        $computed = $this->computeGrade($validated);

        $grade = Grade::updateOrCreate(
            [
                'enrollment_id' => $validated['enrollment_id'],
                'subject_id' => $validated['subject_id'],
            ],
            array_merge($validated, $computed)
        );

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
            'enrollment_id' => 'sometimes|exists:enrollments,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'q1' => 'sometimes|integer|min:0|max:100',
            'q2' => 'sometimes|integer|min:0|max:100',
            'q3' => 'sometimes|integer|min:0|max:100',
            'q4' => 'sometimes|integer|min:0|max:100',
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
