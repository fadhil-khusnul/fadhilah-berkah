<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'featuredProducts' => Product::where('is_featured', true)->take(5)->get(),
            'allProducts' => Product::latest()->get(),
        ]);
    }
}
