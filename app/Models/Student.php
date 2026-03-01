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
        'gender'
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
