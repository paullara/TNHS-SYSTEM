<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;

class TeacherAccountController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:240',
            'firstname' => 'required|string|max:240',
            'middlename' => 'nullable|string|max:240',
            'lastname' => 'required|string|max:240',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6'
        ]);

        $teacher = User::create([
            'username' => $request->username,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'teacher'
        ]);

        return response()->json([
            'message' => 'Teacher account created successfully',
            'data' => $teacher
        ], 201);
    }

    public function index()
    {
        $teachers = User::where('role', 'teacher')->get();

        return response()->json($teachers);
    }

    public function show($id)
    {
        $teacher = User::where('role', 'teacher')->find($id);

        if (!$teacher) {
            return response()->json([
               'message' => 'Teacher not found' 
            ], 404);
        }

        return response()->json($teacher);
    }

    public function update(Request $request, $id)
{
    $teacher = User::where('role', 'teacher')->find($id);

    if (!$teacher) {
        return response()->json([
            'message' => 'Teacher not found'
        ], 404);
    }

    $request->validate([
        'username' => 'sometimes|string|max:240',
        'firstname' => 'sometimes|string|max:240',
        'middlename' => 'sometimes|string|max:240',
        'lastname' => 'sometimes|string|max:240',
        'email' => 'sometimes|email|unique:users,email,' . $teacher->id,
        'password' => 'sometimes|string|min:6',
    ]);

    $teacher->update($request->only([
        'username',
        'firstname',
        'middlename',
        'lastname',
        'email',
        'password'
    ]));

    return response()->json([
        'message' => 'Teacher updated successfully',
        'data' => $teacher,
    ]);
}

    public function destroy($id) 
    {
        $teacher = User::where('role', 'teacher')->find($id);

        if (!$teacher) {
            return response()->json([
                'message' => 'Teacher not found',
            ], 404);
        }

        $teacher->delete();

        return response()->json([
            'message' => 'Teacher deleted successfully',
        ]);
    }
}
