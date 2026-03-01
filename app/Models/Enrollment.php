<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $fillable = [
        'student_id',
        'school_year_id',
        'grade_level_id',
        'section_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function grade()
    {
        return $this->hasMany(Grade::class);
    }
}
