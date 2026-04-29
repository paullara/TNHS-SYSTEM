<?php

namespace App\Http\Controllers;

use App\Models\GradeLevel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeLevelController extends Controller
{
    public function index()
    {
        $gradeLevel = GradeLevel::all();

        return response()->json([
            'gradeLevel' => $gradeLevel,
        ]);
    }

    public function gradeLevelPage()
    {
        return Inertia::render('Admin/GradeLevel/GradeLevel');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:200',
        ]);

        $gradeLevel = GradeLevel::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Grade level created successfully',
            'data' => $gradeLevel,
        ], 201);
    }

    public function show($id)
    {
        $gradeLevel = GradeLevel::find($id);

        if (! $gradeLevel) {
            return response()->json([
                'message' => 'Grade level not found',
            ], 404);
        }

        return response()->json($gradeLevel);
    }

    public function update(Request $request, $id)
    {
        $gradeLevel = GradeLevel::find($id);

        if (! $gradeLevel) {
            return response()->json([
                'message' => 'Grade level not found',
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:240',
        ]);

        $gradeLevel->update($request->only([
            'name',
        ]));

        return response()->json([
            'message' => 'Grade level updated successfully',
            'data' => $gradeLevel,
        ]);
    }

    public function destroy($id)
    {
        $gradeLevel = GradeLevel::find($id);

        $gradeLevel->delete();

        return response()->json([
            'message' => 'Grade level successfully deleted',
        ]);
    }
}
