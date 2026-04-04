<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Kemeja Batik Modern',
                'selling_price' => 150000,
                'unit' => 'pcs',
                'stock' => 20,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
                'description' => 'Kemeja batik dengan desain modern, cocok untuk acara formal maupun santai.',
            ],
            [
                'name' => 'Celana Chino Slim Fit',
                'selling_price' => 175000,
                'unit' => 'pcs',
                'stock' => 15,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
                'description' => 'Celana chino berkualitas tinggi dengan potongan slim fit yang nyaman.',
            ],
            [
                'name' => 'Kaos Polos Premium',
                'selling_price' => 75000,
                'unit' => 'pcs',
                'stock' => 50,
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
                'description' => 'Kaos polos bahan cotton combed 30s yang lembut dan menyerap keringat.',
            ],
            [
                'name' => 'Jaket Bomber Navy',
                'selling_price' => 250000,
                'unit' => 'pcs',
                'stock' => 10,
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
                'description' => 'Jaket bomber dengan warna navy yang elegan, tahan angin dan nyaman.',
            ],
            [
                'name' => 'Hijab Segiempat Voal',
                'selling_price' => 45000,
                'unit' => 'pcs',
                'stock' => 100,
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
                'description' => 'Hijab voal premium yang mudah dibentuk dan tidak menerawang.',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
