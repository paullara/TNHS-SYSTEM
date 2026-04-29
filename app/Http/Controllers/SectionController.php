<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::with('gradeLevel', 'adviser')->get();

        return response()->json([
            'sections' => $sections,
        ]);
    }

    public function sectionList()
    {
        return Inertia::render('Admin/Section/SectionList');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'adviser_id' => 'required|exists:users,id',
        ]);

        $section = Section::create($validated);

        return response()->json([
            'message' => 'Section created successfully',
            'data' => $section,
        ], 201);
    }

    public function show($id)
    {
        $section = Section::with('gradeLevel')->findOrFail($id);

        return response()->json($section);
    }

    public function edit(Section $section)
    {
        return Inertia::render('Admin/Section/EditSection', [
            'section' => $section,
        ]);
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'adviser_id' => 'required|exists:users,id',
        ]);

        $section->update($validated);

        return response()->json([
            'message' => 'Section updated successfully',
            'data' => $section,
        ]);
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);

        if (! $section) {
            return response()->json([
                'message' => 'Section not found',
            ], 404);
        }

        $section->delete();

        return response()->json([
            'message' => 'Section deleted successfully.',
        ]);
    }
}
