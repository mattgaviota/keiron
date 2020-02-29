<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ValidationHelper
{
    public function authenticateValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'mail' => 'required|email',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function createUserValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|min:3',
            'mail' => 'required|email',
            'id_tipousuario' => 'required|numeric|min:1',
            'password' => 'required|string',
            'confirmed_password' => 'required|string|same:password',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function createTicketValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'sometimes|numeric|min:1',
            'ticket_pedido' => 'required|string|min:3',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function assignTicketValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'id_usuario' => 'required|numeric|min:1',
            'id_ticket' => 'required|numeric|min:1',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function editTicketValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'id_ticket' => 'required|numeric|min:1',
            'id_usuario' => 'sometimes|numeric|min:1',
            'ticket_pedido' => 'sometimes|string|min:3',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function deleteTicketValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'id_ticket' => 'required|numeric|min:1',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function resetPasswordUserValidation($request)
    {
        $validator = Validator::make($request->all(), [
            'userId' => 'required|numeric|min:1',
            'password' => 'required|string',
            'confirmed_password' => 'required|string|same:password',
        ]);
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }

    public function getUsersValidation($request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'clientIds' => 'sometimes|array|min:1',
                'clientIds.*' => 'required_with:clientIds|numeric|min:1',
                'roleIds' => 'sometimes|array|min:1',
                'roleIds.*' => 'required_with:roleIds|numeric|min:1',
                'searchField' => 'sometimes|string',
                'status' => 'sometimes|array|min:1',
                'status.*' => 'required_with:status|boolean',
                'pagination' => 'required',
                'pagination.page' => 'required|numeric|min:1',
                'pagination.per_page' => 'sometimes|numeric|min:1',
                'sort' => 'sometimes',
                'sort.field' => 'required_with:sort|string|min:1',
                'sort.order' => 'required_with:sort|string|in:asc,desc',
            ]
        );
        if ($validator->fails()) {
            return $validator->errors()->all();
        }
        return [];
    }
}
