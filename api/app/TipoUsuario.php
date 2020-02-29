<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoUsuario extends Model
{
    protected $table = 'tipo_usuario';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name'];
    protected $hidden = ['created_at', 'updated_at'];

    /*
    * Get the users
    */
    public function usuarios()
    {
        return $this->hasMany('App\Usuario', 'id_tipousuario');
    }
}
