<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function teachersAccount()
    {
        return Inertia::render('Admin/Teachers');
    }

    public function allStudentGrades(Request $request)
    {
        $lrn = $request->query('lrn');

        $students = $lrn
            ? Student::where('LRN', $lrn)->get()
            : Student::all();

        if ($lrn && $students->isEmpty()) {
            return response()->json([
                'message' => 'Student not found',
            ], 404);
        }

        $data = $students->map(function ($student) {

            $enrollment = Enrollment::where('student_id', $student->id)->first();
            if (! $enrollment) {
                return null;
            }

            $section = $enrollment->section;
            $strand = $enrollment->strand;
            $adviser = $section?->adviser;
            $sy = $enrollment->schoolYear->label;

            $subjects = Subject::where('section_id', $enrollment->section_id)
                ->with([
                    'grades' => function ($q) use ($enrollment) {
                        $q->where('enrollment_id', $enrollment->id);
                    },
                    'gradeLevel',
                ])
                ->get()
                ->map(function ($subject) {

                    $grade = $subject->grades->first();

                    $q1 = $grade->q1 ?? null;
                    $q2 = $grade->q2 ?? null;
                    $q3 = $grade->q3 ?? null;
                    $q4 = $grade->q4 ?? null;

                    // ✅ COMPUTE FINALS
                    $firstSemFinal = ($q1 !== null && $q2 !== null)
                        ? round(($q1 + $q2) / 2, 2)
                        : null;

                    $secondSemFinal = ($q3 !== null && $q4 !== null)
                        ? round(($q3 + $q4) / 2, 2)
                        : null;

                    return [
                        'subject' => $subject->name,
                        'q1' => $q1,
                        'q2' => $q2,
                        'q3' => $q3,
                        'q4' => $q4,
                        'first_sem_final' => $firstSemFinal,
                        'second_sem_final' => $secondSemFinal,
                        'semester' => $subject->semester,
                        'grade_level' => $subject->gradeLevel?->name,
                    ];
                });

            // ✅ GROUP BY SEM
            $firstSem = $subjects
                ->filter(fn ($s) => $s['semester'] == 1 || $s['semester'] == '1ST')
                ->values();

            $secondSem = $subjects
                ->filter(fn ($s) => $s['semester'] == 2 || $s['semester'] == '2ND')
                ->values();

            // ✅ COMPUTE AVERAGES
            $getAvg = fn ($collection, $key) => round(collect($collection)->pluck($key)->filter()->avg(), 2);

            $firstSemAvg = $getAvg($firstSem, 'first_sem_final');
            $secondSemAvg = $getAvg($secondSem, 'second_sem_final');

            $generalAverage = round(
                collect([$firstSemAvg, $secondSemAvg])->filter()->avg(),
                2
            );

            return [
                'student' => [
                    'name' => $student->firstname.' '.$student->lastname,
                    'lrn' => $student->LRN,
                ],
                'section' => [
                    'name' => $section?->name,
                    'adviser' => $adviser
                        ? $adviser->firstname.' '.$adviser->lastname
                        : null,
                ],
                'first_sem' => [
                    'subjects' => $firstSem,
                    'average' => $firstSemAvg,
                ],
                'second_sem' => [
                    'subjects' => $secondSem,
                    'average' => $secondSemAvg,
                ],
                'general_average' => $generalAverage,
                'strand' => $strand,
                'sy' => $sy,
            ];
        })->filter()->values();

        return response()->json($data);
    }

    public function gradePage()
    {
        return Inertia::render('Admin/Grades/StudentGrades');
    }
}
