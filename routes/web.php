<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentDataController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherAccountController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSubjectController;
use App\Http\Controllers\UnauthorizedController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/login');
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/unauthorized', [UnauthorizedController::class, 'unauthorized'])->name('unauthorized');

// Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('teachers', [TeacherAccountController::class, 'teacherList'])->name('teachers.list');
    Route::get('/teachers/create', [TeacherAccountController::class, 'create'])->name('teachers.create');
    Route::get('/teachers/edit/{teacher}', [TeacherAccountController::class, 'edit'])->name('teachers.edit');
    Route::get('/sections', [SectionController::class, 'sectionList'])->name('section.list');
    Route::get('/school-year', [SchoolYearController::class, 'syList'])->name('sy.list');
    Route::get('/grade-level', [GradeLevelController::class, 'gradeLevelPage'])->name('gradelevel.page');
    Route::get('/students', [StudentDataController::class, 'create'])->name('student.create');
    Route::get('/subjects', [SubjectController::class, 'subjectPage'])->name('subject.page');
    Route::get('/teacher-subjects', [TeacherSubjectController::class, 'assignTeacherToSubject'])->name('assign-subject');
    Route::get('/enrollments,', [EnrollmentController::class, 'create'])->name('enrollment.create');
    Route::get('/all-student-grades', [AdminController::class, 'allStudentGrades']);
    Route::get('/student-grade', [AdminController::class, 'gradePage'])->name('grade');
    Route::get('/learning', [LearningController::class, 'understanding'])->name('understanding');
    Route::get('/students-grade', [LearningController::class, 'studentGrades']);
    Route::get('/fuck/dahsboard', [AdminController::class, 'testLayout'])->name('fuck.page');
});

// Teacher
Route::middleware('auth')->group(function () {
    Route::resource('/grades', GradeController::class);
    Route::get('/teacher/dashboard', [TeacherController::class, 'dashboard'])->name('teacher.dashboard');
    Route::get('/teacher/subjects/{subject}/students', [TeacherController::class, 'getStudentsBySubject']);
});

require __DIR__.'/auth.php';
