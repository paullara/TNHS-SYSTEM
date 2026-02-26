<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    //

    public function gradeLevels()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }
}
