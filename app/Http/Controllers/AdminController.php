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

            $enrollments = Enrollment::where('student_id', $student->id)
                ->with(['section.adviser', 'section.gradeLevel', 'schoolYear'])
                ->orderBy('school_year_id')
                ->orderBy('created_at')
                ->get();

            // Group enrollments by school year to show progression
            $groupedBySchoolYear = $enrollments->groupBy(function ($enrollment) {
                return $enrollment->schoolYear->label;
            });

            return $groupedBySchoolYear->map(function ($yearEnrollments, $schoolYearLabel) use ($student) {
                // Get the latest enrollment for this school year (highest grade level)
                $latestEnrollment = $yearEnrollments->sortByDesc(function ($enrollment) {
                    return $enrollment->section->gradeLevel->name ?? 0;
                })->first();

                $admission = $latestEnrollment->created_at;
                $section = $latestEnrollment->section;
                $strand = $latestEnrollment->strand;
                $adviser = $section?->adviser;
                $gradeLevel = $section?->gradeLevel?->name;
                $sy = $schoolYearLabel;

                // Get all subjects for all enrollments in this school year
                $allSubjects = collect();
                foreach ($yearEnrollments as $enrollment) {
                    $subjects = Subject::where('section_id', $enrollment->section_id)
                        ->with([
                            'grades' => function ($q) use ($enrollment) {
                                $q->where('enrollment_id', $enrollment->id);
                            },
                            'gradeLevel',
                        ])
                        ->get()
                        ->map(function ($subject) use ($enrollment) {

                            $grade = $subject->grades->first();

                            $q1 = $grade->q1 ?? null;
                            $q2 = $grade->q2 ?? null;
                            $q3 = $grade->q3 ?? null;
                            $q4 = $grade->q4 ?? null;

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
                                'subject_indicate' => $subject->subject_indicate,
                                'remedial' => $grade->remedial ?? null,
                                'final_grade' => $grade->final_grade ?? null,
                                'enrollment_grade_level' => $enrollment->section->gradeLevel->name ?? null,
                            ];
                        });

                    $allSubjects = $allSubjects->merge($subjects);
                }

                $firstSem = $allSubjects
                    ->filter(fn ($s) => $s['semester'] == 1 || $s['semester'] == '1ST')
                    ->values();

                $secondSem = $allSubjects
                    ->filter(fn ($s) => $s['semester'] == 2 || $s['semester'] == '2ND')
                    ->values();

                $getAvg = fn ($collection, $key) => round(collect($collection)->pluck($key)->filter()->avg(), 2);

                $firstSemAvg = $getAvg($firstSem, 'first_sem_final');
                $secondSemAvg = $getAvg($secondSem, 'second_sem_final');

                $generalAverage = round(
                    collect([$firstSemAvg, $secondSemAvg])->filter()->avg(),
                    2
                );

                return [
                    'student' => [
                        'name' => $student->firstname.' '.$student->middlename.' '.$student->lastname,
                        'lrn' => $student->LRN,
                        'date_of_birth' => $student->birthdate,
                        'sex' => $student->gender,
                    ],
                    'section' => [
                        'name' => $section?->name,
                        'adviser' => $adviser
                            ? $adviser->firstname.' '.$adviser->lastname
                            : null,
                    ],
                    'grade_level' => $gradeLevel,
                    'first_sem' => [
                        'subjects' => $firstSem,
                        'average' => $firstSemAvg,
                    ],
                    'second_sem' => [
                        'subjects' => $secondSem,
                        'average' => $secondSemAvg,
                    ],
                    'admission' => $admission,
                    'general_average' => $generalAverage,
                    'strand' => $strand,
                    'sy' => $sy,
                    'all_enrollments' => $yearEnrollments->map(function ($enrollment) {
                        return [
                            'grade_level' => $enrollment->section->gradeLevel->name ?? null,
                            'section' => $enrollment->section->name ?? null,
                            'school_year' => $enrollment->schoolYear->label ?? null,
                            'strand' => $enrollment->strand,
                        ];
                    }),
                ];
            })->values();

        })->flatten(1)->values();

        return response()->json($data);
    }

    public function gradePage()
    {
        return Inertia::render('Admin/Grades/StudentGrades');
    }

    public function understanding()
    {
        return Inertia::render('Admin/Grades/Learning');
    }

    public function testPage()
    {
        return Inertia::render('TestPage/TestLayout');
    }

    public function testGradePage()
    {
        return Inertia::render('Admin/TestGrade');
    }
}
