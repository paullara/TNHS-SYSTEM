<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    //

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function schoolYears()
    {
        return $this->hasMany(SchoolYear::class);
    }

    public function gradeLevels()
    {
        return $this->hasMany(GradeLevel::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
