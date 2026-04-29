<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'enrollment_id',
        'subject_id',
        'teacher_id',
        'q1',
        'q2',
        'q3',
        'q4',
        'first_sem',
        'second_sem',
        'semester_final_grade',
        'general_average',
        'status',
        'is_finalized',
        'remedial',
        'final_grade',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class);
    }
}
