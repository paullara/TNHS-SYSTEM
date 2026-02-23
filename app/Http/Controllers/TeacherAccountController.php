<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class TeacherAccountController extends Controller
{
    public function createTeacherAccount(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:240',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6'
        ]);

        $teacher = User::create([
            'name' => $request->name,
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

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|users:email',
            'password' => Hash::make($request->password)
        ]);

        $teacher = User::update([

        ]);
    }
}
