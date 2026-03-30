<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::role('Kasir')->first() ?? User::first();
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');
            return;
        }

        // Clean existing transactions for the period if needed
        // Transaction::truncate(); 

        for ($i = 0; $i <= 10; $i++) {
            $date = Carbon::now()->subDays($i);
            $numTransactions = rand(3, 8);

            for ($j = 0; $j < $numTransactions; $j++) {
                $totalAmount = 0;
                $details = [];

                // Create 1-3 items per transaction
                $numItems = rand(1, 4);
                $selectedProducts = $products->random($numItems);

                foreach ($selectedProducts as $product) {
                    $qty = rand(1, 3);
                    $subtotal = $product->selling_price * $qty;
                    $totalAmount += $subtotal;

                    $details[] = [
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'price' => $product->selling_price,
                        'subtotal' => $subtotal,
                    ];
                }

                $transaction = Transaction::create([
                    'invoice_number' => 'INV-' . strtoupper(Str::random(8)) . '-' . $date->format('Ymd'),
                    'total_amount' => $totalAmount,
                    'payment_method' => rand(0, 1) ? 'cash' : 'transfer',
                    'cashier_id' => $cashier->id,
                    'created_at' => $date->copy()->addHours(rand(9, 20))->addMinutes(rand(0, 59)),
                ]);

                foreach ($details as $detail) {
                    $transaction->details()->create($detail);
                }
            }
        }
    }
}
