<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->decimal('first_sem', 5, 2)->nullable();
            $table->decimal('second_sem', 5, 2)->nullable();
            $table->decimal('semester_final_grade', 5, 2)->nullable();
            $table->decimal('general_average', 5, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropColumn('first_sem', 5, 2);
            $table->dropColumn('second_sem', 5, 2);
            $table->dropColumn('semester_final_grade', 5,2 );
            $table->dropColumn('general_average', 5, 2);
        });
    }
};
