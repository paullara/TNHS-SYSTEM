<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TeacherAccountController;
use App\Http\Controllers\StudentDataController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('teachers', TeacherAccountController::class);
Route::apiResource('students', StudentDataController::class);
 