<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin Fadhilah',
            'email' => 'admin@fadhilah.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('Admin');

        $kasir = User::create([
            'name' => 'Kasir Fadhilah',
            'email' => 'kasir@fadhilah.com',
            'password' => Hash::make('password'),
        ]);
        $kasir->assignRole('Kasir');
    }
}
