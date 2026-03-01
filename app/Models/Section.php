<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $fillable = [
        'name',
        'grade_level_id'
    ];

    public function gradeLevels()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function enrollment()
    {
        return $this->hasMany(Enrollment::class);
    }
}
