<?php

namespace App\Http\Controllers;

use App\Usuario;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function get(Request $request)
    {
        $tipo = $request->auth->tipo->nombre;
        if ($tipo == 'Usuario') {
            return response()->json(['data' => [], 'errors' => ['Your user cannot perform this operation']], 403);
        }
        $users = Usuario::select('usuarios.id', 'usuarios.nombre')
            ->join('tipo_usuario', 'usuarios.id_tipousuario', '=', 'tipo_usuario.id')
            ->where('tipo_usuario.nombre', 'Usuario')
            ->get()
        ;
        return response()->json(['data' => $users, 'errors' => []], 200);
    }
}
