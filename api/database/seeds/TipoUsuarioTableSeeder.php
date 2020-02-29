<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TipoUsuarioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $date = Carbon::now();
        $types = [
            ['nombre' => 'Administrador', 'created_at' => $date, 'updated_at' => $date],
            ['nombre' => 'Usuario', 'created_at' => $date, 'updated_at' => $date]
        ];
        DB::table('tipo_usuario')->insert($types);
    }
}
