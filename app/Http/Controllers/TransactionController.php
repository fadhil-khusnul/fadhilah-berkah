<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with('cashier')
            ->when($request->search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function show(Transaction $transaction)
    {
        return Inertia::render('transactions/Show', [
            'transaction' => $transaction->load('details.product', 'cashier'),
        ]);
    }

    public function print(Transaction $transaction)
    {
        $transaction->load('details.product', 'cashier');
        
        $pdf = Pdf::loadView('pdf.receipt', [
            'transaction' => $transaction,
            'store' => [
                'name' => 'Fadhilah Berkah',
                'owner' => 'Nuraeni',
                'address' => 'Jln. Hasanuddin, Pasar Inhutani, Nunukan',
                'contact' => '085252111128',
            ]
        ])->setPaper([0, 0, 164.41, 400], 'portrait'); // 58mm width approx

        return $pdf->stream("{$transaction->invoice_number}.pdf");
    }
}
