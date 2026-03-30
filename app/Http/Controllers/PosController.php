<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockHistory;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index()
    {
        return Inertia::render('pos/Index', [
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'total_amount' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $invoice = 'INV-' . strtoupper(uniqid());

            $transaction = Transaction::create([
                'invoice_number' => $invoice,
                'total_amount' => $request->total_amount,
                'payment_method' => $request->payment_method,
                'cashier_id' => Auth::id(),
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} tidak mencukupi.");
                }

                $product->decrement('stock', $item['quantity']);

                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->selling_price,
                    'subtotal' => $product->selling_price * $item['quantity'],
                ]);

                StockHistory::create([
                    'product_id' => $item['id'],
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'reason' => "Penjualan {$invoice}",
                    'user_id' => Auth::id(),
                ]);
            }

            return back()->with([
                'success' => 'Transaksi berhasil!',
                'invoice' => $invoice,
                'transaction_id' => $transaction->id
            ]);
        });
    }
}
