<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function showSignup()
    {
        return view('signup');
    }

    public function signup(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);
    
        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password']),
            ]);
    
            Auth::login($user);
    
            return redirect('/graph'); // Replace '/graph' with the desired redirect URL after successful signup
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'signup_failed' => 'Sign up failed. Please try again.',
            ]);
        }
    }
    

    public function show()
    {
        return view('home');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            return redirect('/graph'); // Replace '/dashboard' with the desired redirect URL after successful login
        }

        return redirect()->back()->withErrors([
            'login_failed' => 'Invalid credentials',
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/'); // Replace '/' with the desired redirect URL after logout
    }
}
