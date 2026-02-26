<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherAccountController;
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

Route::prefix('teachers')->group(function () {
    Route::post('/', [TeacherAccountController::class, 'store']);
    Route::get('/', [TeacherAccountController::class, 'index']);
    Route::get('/{id}', [TeacherAccountController::class, 'show']);
    Route::put('/{id}', [TeacherAccountController::class, 'update']);
    Route::delete('/{id}', [TeacherAccountController::class, 'destroy']);
});

require __DIR__.'/auth.php';
