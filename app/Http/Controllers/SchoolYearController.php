<?php

namespace App\Http\Controllers;

use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schoolYear = SchoolYear::all();

        return response()->json([
            'schoolYear' => $schoolYear,
        ]);

        // return Inertia::render('Admin/SchoolYear/SchoolYearPage');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/SchoolYear/Create');
    }

    public function syList()
    {
        return Inertia::render('Admin/SY/SYList');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $schoolYear = SchoolYear::create([
            'label' => $request->label,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);

        return response()->json([
            'message' => 'School year created successfully!',
            'data' => $schoolYear,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $schoolYear = SchoolYear::find($id);

        if (! $schoolYear) {
            return response()->json([
                'message' => 'School year not found',
            ], 404);
        }

        return response()->json([
            'schoolYear' => $schoolYear,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // for later
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $schoolYear = SchoolYear::find($id);

        if (! $schoolYear) {
            return response()->json([
                'message' => 'School year not found',
            ]. 404);
        }

        $request->validate([
            'label' => 'sometimes|string|max:50',
            'start_date' => 'sometimes|string|max:240',
            'end_date' => 'sometimes|date|after:start_date',
        ]);

        $schoolYear->update($request->only([
            'label',
            'start_date',
            'end_date',
        ]));

        return response()->json([
            'message' => 'SY updated successfully',
            'sy' => $schoolYear,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $schoolYear = SchoolYear::find($id);

        if (! $schoolYear) {
            return response()->json([
                'message' => 'School year not found!',
            ], 404);
        }

        $schoolYear->delete();

        return response()->json([
            'message' => 'School year deleted',
        ]);
    }
}
