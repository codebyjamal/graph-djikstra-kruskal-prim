<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/graph', function () {
    return view('graph');
})->name("graph");

Route::get('/signup', [AuthController::class, 'showSignup'])->name('signup');
Route::post('/signup', [AuthController::class, 'signup'])->name('signup.submit');
Route::get('/', [AuthController::class, 'show'])->name('login');
Route::post('/', [AuthController::class, 'login'])->name('login.submit');
Route::post('/graph', [AuthController::class, 'logout'])->name('logout');
