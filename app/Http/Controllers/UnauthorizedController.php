<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UnauthorizedController extends Controller
{
    public function unauthorized()
    {
        return Inertia::render('Unauthorized');
    }
}
