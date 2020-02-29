<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use SoftDeletes;
    protected $table = 'tickets';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ticket_pedido', 'id_usuario'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at'];

    /*
    * Get the users
    */
    public function usuario()
    {
        return $this->belongsTo('App\Usuario', 'id_usuario');
    }
}
