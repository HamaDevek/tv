<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlaylistResource;
use App\Playlist;
use Illuminate\Http\Request;

class IptvController extends Controller
{
    public function index(Request $request)
    {
        $api = "/get.php/i";
        $m3u = "/&type=m3u&output=ts/i";
        $url = preg_replace($api, "panel_api.php", preg_replace($m3u, "&type=m3u_plus&output=ts", $request->url));
        preg_match('/\b(\?username=)([A-Za-z0-9\/]+)/', $url, $matches);
        ini_set('default_socket_timeout', 10);
        $isDublicate = false;
        $playlists = Playlist::where('p_link', $url)->get();
        foreach ($playlists as $k => $v) {
            if ($v->p_link == $url) {
                $isDublicate = true;
                return response()->json(['message' => 'Dublicated Playlist'], 422);
                break;
            }
        }
        if (!$fp = @fopen($url, "r")) {
            return response()->json(['message' => 'Not Found.'], 404);
        } else {
            fclose($fp);
            if (!$isDublicate) {
                $playlist = new Playlist;
                $playlist->p_name = $matches[2];
                $playlist->p_link =  $url;
                $playlist->p_time = $request->timeout;
                $playlist->save();
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            $result = curl_exec($ch);
            curl_close($ch);
            // return new PlaylistResource($playlist);

            return ['result' => json_decode($result), 'playlist' => new PlaylistResource($playlist)];
        }
    }
    public function test(Request $request)
    {
        //http://new-pro.tv:6204/panel_api.php?username=mbcytr&password=foreverpro&type=m3u_plus&output=ts
        // http://new-pro.tv:6204/get.php?username=mbcytr&password=foreverpro&type=m3u&output=ts

        ini_set('default_socket_timeout', $request->time);
        if (!$fp = @fopen($request->id, "r")) {
            return  'f';
        } else {
            return  'a';
            fclose($fp);
        }
    }
    public function get_api(Request $request)
    {

        $api = "/get.php/i";
        $m3u = "/&type=m3u&output=ts/i";
        $url = preg_replace($api, "panel_api.php", preg_replace($m3u, "&type=m3u_plus&output=ts", $request->url));
        ini_set('default_socket_timeout', 10);
        if (!$fp = @fopen($url, "r")) {
            return response()->json(['message' => 'Not Found.'], 404);
        } else {
            fclose($fp);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            $result = curl_exec($ch);
            curl_close($ch);
            return $result;
        }
    }
    public function channels()
    {
        return PlaylistResource::collection(Playlist::all());
    }
    public function delete_channel($id)
    {
        try {
            $playlist = Playlist::findOrFail($id);
            $playlist->delete();
            return response()->json(['message' => 'Successfuly Playlist Deleted'], 200);
        } catch (\Exception $th) {
            return response()->json(['message' => 'Not Found Playlist'], 404);
        }
    }
    public function edit_channel(Request $request)
    {
        $api = "/get.php/i";
        $m3u = "/&type=m3u&output=ts/i";
        $url = preg_replace($api, "panel_api.php", preg_replace($m3u, "&type=m3u_plus&output=ts", $request->url));
        // preg_match('/\b(\?username=)([A-Za-z0-9\/]+)/', $url, $matches);
        $playlist = Playlist::find($request->id);
        $isDublicate = false;
        $playlists = Playlist::where('p_link', $url)->get();
        foreach ($playlists as $k => $v) {
            if ($v->p_link == $url && $url != $playlist->p_link) {
                $isDublicate = true;
                return response()->json(['message' => 'Dublicated Playlist'], 422);
                break;
            }
        }

        ini_set('default_socket_timeout', 10);
        if (!$fp = @fopen($url, "r")) {
            return response()->json(['message' => 'Not Found.'], 404);
        } else {
            fclose($fp);
            $playlist->p_name = $request->name;
            $playlist->p_link =  $url;
            $playlist->p_time = $request->timeout;
            $playlist->save();
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPGET, 1);
            $result = curl_exec($ch);
            curl_close($ch);
            return ['result' => json_decode($result), 'playlist' => new PlaylistResource($playlist)];
        }
    }
}
