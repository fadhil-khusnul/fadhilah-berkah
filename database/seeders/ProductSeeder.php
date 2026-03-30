<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Kemeja Batik Modern', 'selling_price' => 150000, 'unit' => 'pcs', 'stock' => 20],
            ['name' => 'Celana Chino Slim Fit', 'selling_price' => 175000, 'unit' => 'pcs', 'stock' => 15],
            ['name' => 'Kaos Polos Premium', 'selling_price' => 75000, 'unit' => 'pcs', 'stock' => 50],
            ['name' => 'Jaket Bomber Navy', 'selling_price' => 250000, 'unit' => 'pcs', 'stock' => 10],
            ['name' => 'Hijab Segiempat Voal', 'selling_price' => 45000, 'unit' => 'pcs', 'stock' => 100],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
