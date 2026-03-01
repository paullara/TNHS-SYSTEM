<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentDataController extends Controller
{
    public function store()
    {
        $request->validate([
            'LRN' => 'required|integer|max:20',
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

    public function index()
    {
        $students = Student::all();

        return response()->json($students);
    }

    public function show($id)
    {
        $student = User::all();

        $targetStudent = $student->find($id);

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
            'LRN' => 'sometimes|string|max:240',
            'firstname' => 'sometimes|string:max:240',
            'middlename' => 'sometimes|string:max:240',
            'lastname' => 'sometimes|sting:max:240',
            'birthdate' => 'sometimes|date',
            'gender' => 'sometimes|string|max:240',
        ]);
    }
}
