<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Inertia\Inertia;

class StudentDataController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'LRN' => 'required|string|max:20',
            'firstname' => 'required|string|max:255',
            'middlename' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'gender' => 'required|string|max:20',
        ]);

        $student = Student::create([
            'LRN' => $request->LRN,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'birthdate' => $request->birthdate,
            'gender' => $request->gender,
        ]);

        return response()->json([
            'message' => 'Student data added successfully.',
            'data' => $student
        ], 201);
    }

    public function create()
    {
        return Inertia::render('Admin/Student/StudentCreate');
    }

    public function index()
    {
        $students = Student::all();

        return response()->json([
            'students' => $students
        ]);
    }

    public function show($id)
    {
        $student = Student::all();

        $targetStudent = $student->find($id);

        if (!$targetStudent) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        return response()->json([
            $targetStudent
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = Student::all();

        $targetStudent = $student->find($id);

        if (!$targetStudent) {
            return response()->json([
                'message' => 'Student not found',
            ], 404);
        }

        $request->validate([
            'LRN' => 'sometimes|integer',
            'firstname' => 'sometimes|string:max:240',
            'middlename' => 'sometimes|string:max:240',
            'lastname' => 'sometimes|string:max:240',
            'birthdate' => 'sometimes|date',
            'gender' => 'sometimes|string|max:240',
        ]);

        $targetStudent->update($request->only([
            'LRN',
            'firstname',
            'middlename',
            'lastname',
            'birthdate',
            'gender',
        ]));

        return response()->json([
            'message' => 'Student updated successfully',
            'data' => $targetStudent,
        ]);
    }

    public function destroy($id) 
    {
        $student = Student::findOrFail($id);

        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully'
        ]);
    }
}
