<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsuarioTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $date = Carbon::now();
        $users = [
            [
                'nombre' => 'Administrador',
                'mail' => 'admin@tickets.test',
                'password' => Hash::make('123456'),
                'id_tipousuario' => 1,
                'created_at' => $date,
                'updated_at' => $date
            ],
            [
                'nombre' => 'Usuario',
                'mail' => 'usuario@tickets.test',
                'password' => Hash::make('1234'),
                'id_tipousuario' => 2,
                'created_at' => $date,
                'updated_at' => $date
            ],
        ];
        DB::table('usuarios')->insert($users);
    }
}
