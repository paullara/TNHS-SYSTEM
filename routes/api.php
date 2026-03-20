<?php

use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\FuckController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentDataController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherAccountController;
use App\Http\Controllers\TeacherSubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('teachers', TeacherAccountController::class);
Route::apiResource('students', StudentDataController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('sy', SchoolYearController::class);
Route::apiResource('gl', GradeLevelController::class);
Route::apiResource('sections', SectionController::class);
Route::apiResource('subjects', SubjectController::class);
Route::apiResource('ts', TeacherSubjectController::class);
Route::apiResource('enrollments', EnrollmentController::class);
Route::apiResource('grades', GradeController::class);
Route::apiResource('fuck', FuckController::class);
