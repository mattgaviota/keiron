<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('/auth/login', 'AuthController@login');
    $router->post('/auth/signin', 'AuthController@signin');
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->get('/auth/validate', 'AuthController@validateUser');

        $router->get('/tickets', 'TicketController@get');
        $router->post('/tickets', 'TicketController@create');
        $router->post('/tickets/assign', 'TicketController@assign');
        $router->post('/tickets/edit', 'TicketController@edit');
        $router->post('/tickets/delete', 'TicketController@delete');
        $router->get('/tickets/more', 'TicketController@more');

        $router->get('/types', 'TipoUsuarioController@get');

        $router->get('/users', 'UsuarioController@get');
    });
});
