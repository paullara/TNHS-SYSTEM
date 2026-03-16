<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $fillable = [
        'label',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }
}
