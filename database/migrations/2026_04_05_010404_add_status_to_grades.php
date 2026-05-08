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
            $table->string('status')->nullable();
            $table->integer('remedial')->nullable();
            $table->decimal('final_grade', 5, 2)->nullable();
            $table->boolean('is_finalized')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('remedial');
            $table->dropColumm('final_grade');
            $table->dropColumm('is_finalized');
        });
    }
};
