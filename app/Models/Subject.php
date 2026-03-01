<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'grade_level_id',
    ];

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }
}
