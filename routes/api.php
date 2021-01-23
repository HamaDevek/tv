<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/get', 'IptvController@index');
Route::post('/test', 'IptvController@test');
Route::post('/get_api', 'IptvController@get_api');
Route::get('/channels', 'IptvController@channels');
Route::delete('/channels/delete/{id}', 'IptvController@delete_channel');
Route::post('/channels/edit', 'IptvController@edit_channel');
