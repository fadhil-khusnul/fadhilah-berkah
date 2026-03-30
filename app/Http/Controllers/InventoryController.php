<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::when($request->search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })->latest()->paginate(10)->withQueryString();

        return Inertia::render('inventory/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'selling_price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($request->all());

        // Log initial stock
        StockHistory::create([
            'product_id' => $product->id,
            'type' => 'in',
            'quantity' => $product->stock,
            'reason' => 'Stok Awal',
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Barang berhasil ditambahkan.');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'selling_price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
        ]);

        $product->update($request->only(['name', 'selling_price', 'unit']));

        return back()->with('success', 'Barang berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back()->with('success', 'Barang berhasil dihapus.');
    }

    public function adjust(Request $request, Product $product)
    {
        $request->validate([
            'type' => 'required|in:in,out,adjustment',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
        ]);

        if ($request->type === 'in' || $request->type === 'adjustment') {
            $product->increment('stock', $request->quantity);
        } else {
            $product->decrement('stock', $request->quantity);
        }

        StockHistory::create([
            'product_id' => $product->id,
            'type' => $request->type,
            'quantity' => $request->quantity,
            'reason' => $request->reason,
            'user_id' => Auth::id(),
        ]);

        return back()->with('success', 'Stok berhasil disesuaikan.');
    }

    public function history(Product $product)
    {
        return Inertia::render('inventory/History', [
            'product' => $product,
            'history' => $product->stockHistories()->with('user')->latest()->get(),
        ]);
    }
}
