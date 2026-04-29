<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [
        'name',
        'grade_level_id',
        'adviser_id',
    ];

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function enrollment()
    {
        return $this->hasMany(Enrollment::class);
    }
}
