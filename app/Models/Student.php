<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'LRN',
        'firstname',
        'middlename',
        'lastname',
        'birthdate',
        'gender',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function grades()
    {
        return $this->hasManyThrough(
            Grade::class,
            Enrollment::class,
            'student_id',     // Foreign key on enrollments table
            'enrollment_id',  // Foreign key on grades table
            'id',             // Local key on students table
            'id'              // Local key on enrollments table
        );
    }
}
