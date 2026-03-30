<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $todaySales = Transaction::whereDate('created_at', Carbon::today())->sum('total_amount');
        $lowStock = Product::where('stock', '<', 5)->count();
        $totalTransactions = Transaction::whereDate('created_at', Carbon::today())->count();

        // Chart Data (Last 7 days)
        $chartData = Transaction::selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'todaySales' => $todaySales,
                'lowStock' => $lowStock,
                'totalTransactions' => $totalTransactions,
            ],
            'chartData' => $chartData,
        ]);
    }
}
