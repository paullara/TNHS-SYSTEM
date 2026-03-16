<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherAccountController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TeacherController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

//Admin
Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard'); 
    Route::get('teachers', [TeacherAccountController::class, 'teacherList'])->name('teachers.list');
    Route::get('/teachers/create', [TeacherAccountController::class, 'create'])->name('teachers.create');
    Route::get('/teachers/edit/{teacher}', [TeacherAccountController::class, 'edit'])->name('teachers.edit');
    Route::get('/sections', [SectionController::class, 'sectionList'])->name('section.list');
    Route::get('/school-year', [SchoolYearController::class, 'syList'])->name('sy.list');
});

//Teacher
Route::middleware('auth')->group(function () {
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
});

require __DIR__.'/auth.php';
