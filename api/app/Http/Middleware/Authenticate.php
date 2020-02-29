<?php

namespace App\Http\Middleware;

use Closure;
use App\Usuario;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Illuminate\Contracts\Auth\Factory as Auth;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param  \Illuminate\Contracts\Auth\Factory  $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->bearerToken();
        if(! $token) {
            // Unauthorized response if token not there
            return response()->json(['data' => [], 'errors' => ['Token not available']], 401);
        }
        try {
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e) {
            return response()->json(['data' => [], 'errors' => ['Provided token is expired']], 401);
        } catch(Exception $e) {
            return response()->json(['data' => [], 'errors' => ['An error while decoding token']], 401);
        }
        try {
            $user = Usuario::with(['tipo'])->findOrFail($credentials->sub);
            // Put the user in the request class
            $request->auth = $user;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['data' => [], 'errors' => ['User Not Found']], 401);
        }

        return $next($request);
    }
}
