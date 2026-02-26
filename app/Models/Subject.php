<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    //

    public function gradeLevels()
    {
        return $this->hasMany(GradeLevel::class);
    }

    public function subject()
    {
        return $this->hasMany(Subject::class);
    }
}
