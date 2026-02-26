<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeLevel extends Model
{
    //

    public function sections()  
    {
        return $this->hasMany(GradeLevel::class);
    }

    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function subjects()
    {
        return $this->belongsTo(Subject::class);
    }
}
