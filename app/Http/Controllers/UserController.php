<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:240',
            'firstname' => 'required|string|max:240',
            'middlename' => 'nullable|string|max:240',
            'lastname' => 'required|string|max:240',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $request->username,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Account creaed successfully!',
            'data' => $user,
        ]);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (! $user) {
            return respons()->json([
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $request->validate([
            'username' => 'sometimes|string|max:240',
            'firstname' => 'sometimes|string|max:240',
            'middlename' => 'sometimes|string|max:240',
            'lastname' => 'sometimes|string|max:240',
            'email' => 'sometimes|string|max:240',
            'role' => 'sometimes|string|max:240',
        ]);

        $user->update($request->only([
            'username',
            'firstname',
            'middlename',
            'lastname',
            'email',
            'role',
        ]));

        return response()->json([
            'message' => 'Account updated successfully!',
            'data' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
