<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'enrollment_id',
        'subject_id',
        'teacher_id',
        'quarter1',
        'quarter2',
        'quarter3',
        'quarter4',
        'final_grade',
    ];

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function subject() {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, teacher_id);
    }
}
