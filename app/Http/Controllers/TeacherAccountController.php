<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;

class TeacherAccountController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Teacher/CreateTeacherAccount');
    }

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

        // return redirect()->route('teachers.index')->with('message', 'Teacher account created successfully!');
    }

    public function index()
    {
        $teachers = User::where('role', 'teacher')->get();

        return response()->json([
            'teachers' => $teachers
        ]);

        // return Inertia::render('Admin/Teacher/TeacherList', [
        //     'teachers' => $teachers,
        // ]);
    }

    public function teacherList()
    {
        return Inertia::render('Admin/Teacher/TeacherList');
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

    public function edit(User $teacher)
    {
        return Inertia::render('Admin/Teacher/EditTeacherAccount', [
            'user' => $teacher,
        ]);
    }

    public function testEditTeacherAccount(User $teacher)
    {
        return Inertia::render('Admin/Teacher/TestEditTeacher', [
            'user' => $teacher,
        ]);
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
        ]);

        $teacher->update($request->only([
            'username',
            'firstname',
            'middlename',
            'lastname',
            'email',
        ]));

        return response()->json([
            'message' => 'Teacher updated successfully',
            'data' => $teacher,
        ]);

        // return redirect()
        //     ->route('teachers.index')
        //     ->with('success', 'Teacher account updated successfully!');
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

        // return redirect()->route('teachers.list')->with('message', 'Teacher account deleted successfully!');
    }
}
