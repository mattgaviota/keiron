<?php

namespace App\Http\Controllers;

use App\Ticket;
use App\Helpers\ValidationHelper;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct()
    {
        $this->validator = new ValidationHelper();
    }

    public function get(Request $request)
    {
        $type = $request->auth->tipo->nombre;
        $userId = null;
        if ($type == 'Usuario') {
            $userId = $request->auth->id;
        }
        try {
            $tickets = Ticket::with('usuario')
                ->when($userId, function($query, $userId) {
                    return $query->where('id_usuario', $userId);
                })
                ->orderBy('id_usuario', 'asc')
                ->orderBy('id', 'desc')
                ->get()
            ;
            if ($tickets->isEmpty()) {
                return response()->json(['data' => [], 'errors' => ['Tickets Not Found']], 404);
            }
            return response()->json(['data' => $tickets, 'errors' => []], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['Tickets Not Found']], 404);
        }
    }

    public function create(Request $request)
    {
        $errors = $this->validator->createTicketValidation($request);
        if (! empty($errors)) {
            return response()->json(['data' => [], 'errors' => $errors], 422);
        }
        $type = $request->auth->tipo->nombre;
        if ($type == 'Usuario') {
            return response()->json(['data' => [], 'errors' => ['Your user cannot perform this operation']], 403);
        }
        $ticket = new Ticket();
        $ticket->ticket_pedido = $request->ticket_pedido;
        $ticket->save();
        return response()->json(['data' => $ticket, 'errors' => []], 201);
    }

    public function assign(Request $request)
    {
        $errors = $this->validator->assignTicketValidation($request);
        if (! empty($errors)) {
            return response()->json(['data' => [], 'errors' => $errors], 422);
        }
        $type = $request->auth->tipo->nombre;
        $userId = $request->id_usuario;
        if ($type == 'Usuario') {
            $userId = $request->auth->id;
        }
        try {
            $ticket = Ticket::findOrFail($request->id_ticket);
            $ticket->id_usuario = $userId;
            $ticket->save();
            $ticket = Ticket::with('usuario')->findOrFail($request->id_ticket);
            return response()->json(['data' => $ticket, 'errors' => []], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['Ticket Not Found']], 404);
        }
    }

    public function edit(Request $request)
    {
        $errors = $this->validator->editTicketValidation($request);
        if (! empty($errors)) {
            return response()->json(['data' => [], 'errors' => $errors], 422);
        }
        $type = $request->auth->tipo->nombre;
        if ($type == 'Usuario') {
            return response()->json(['data' => [], 'errors' => ['Your user cannot perform this operation']], 403);
        }
        try {
            $ticket = Ticket::findOrFail($request->id_ticket);
            if ($request->id_usuario) {
                $ticket->id_usuario = $request->id_usuario;
            }
            if ($request->ticket_pedido) {
                $ticket->ticket_pedido = $request->ticket_pedido;
            }
            $ticket->save();
            return response()->json(['data' => $ticket, 'errors' => []], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['Ticket Not Found']], 404);
        }
    }

    public function delete(Request $request)
    {
        $errors = $this->validator->deleteTicketValidation($request);
        if (! empty($errors)) {
            return response()->json(['data' => [], 'errors' => $errors], 422);
        }
        $type = $request->auth->tipo->nombre;
        if ($type == 'Usuario') {
            return response()->json(['data' => [], 'errors' => ['Your user cannot perform this operation']], 403);
        }
        try {
            $ticket = Ticket::findOrFail($request->id_ticket);
            $ticket->delete();
            return response()->json(['data' => $ticket, 'errors' => []], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['Ticket Not Found']], 404);
        }
    }

    public function more(Request $request)
    {
        $type = $request->auth->tipo->nombre;
        if ($type == 'Administrador') {
            return response()->json(['data' => [], 'errors' => ['Your user cannot perform this operation']], 403);
        }
        try {
            $ticket = Ticket::where('id_usuario', null)->first();
            if ($ticket) {
                $ticket->id_usuario = $request->auth->id;
                $ticket->save();
                return response()->json(['data' => $ticket, 'errors' => []], 200);
            }
            return response()->json(['data' => [], 'errors' => ['No more tickets']], 404);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['Ticket Not Found']], 404);
        }
    }
}
