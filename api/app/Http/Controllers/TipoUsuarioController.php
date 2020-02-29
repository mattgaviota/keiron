<?php

namespace App\Http\Controllers;

use App\TipoUsuario;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TipoUsuarioController extends Controller
{
    public function get()
    {
        $types = TipoUsuario::select('id', 'nombre')->get();
        return response()->json(['data' => $types, 'errors' => []], 200);
    }
}
