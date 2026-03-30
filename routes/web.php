<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // POS routes (Admin & Kasir)
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');

    // Transaction history (Admin & Kasir)
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');

    // Admin only routes
    Route::middleware(['role:Admin'])->group(function () {
        // Inventory
        Route::resource('inventory', InventoryController::class);
        Route::post('inventory/{product}/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');
        Route::get('inventory/{product}/history', [InventoryController::class, 'history'])->name('inventory.history');

        // User management
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
Route::get('/auth/login', function () {
    return Inertia::render('auth/login');
})->name('login');
