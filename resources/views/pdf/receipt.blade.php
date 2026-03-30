<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Courier', monospace;
            font-size: 11px;
            line-height: 1.2;
            margin: 4mm;
            width: 48mm;
            color: #000;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        
        .header { margin-bottom: 4mm; }
        .store-name { font-size: 14px; margin-bottom: 1mm; }
        
        .divider { 
            border-top: 1px dashed #000; 
            margin: 2mm 0; 
            height: 0;
        }
        
        .info-table { width: 100%; margin-bottom: 2mm; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table td { padding: 0.5mm 0; vertical-align: top; }
        
        .totals-table { width: 100%; margin-top: 2mm; }
        .total-amount { font-size: 13px; }
        
        .footer { margin-top: 6mm; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header text-center">
        <div class="store-name font-bold">{{ strtoupper($store['name']) }}</div>
        <div>{{ $store['address'] }}</div>
        <div>WA: {{ $store['contact'] }}</div>
    </div>

    <div class="divider"></div>
    
    <table class="info-table">
        <tr>
            <td>No: {{ $transaction->invoice_number }}</td>
        </tr>
        <tr>
            <td>Tgl: {{ $transaction->created_at->format('d/m/y H:i') }}</td>
        </tr>
        <tr>
            <td>Ksr: {{ $transaction->cashier->name }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <table class="items-table">
        @foreach($transaction->details as $detail)
        <tr>
            <td colspan="2">{{ $detail->product->name }}</td>
        </tr>
        <tr>
            <td>{{ $detail->quantity }} x {{ number_format($detail->price, 0, ',', '.') }}</td>
            <td class="text-right">{{ number_format($detail->subtotal, 0, ',', '.') }}</td>
        </tr>
        @endforeach
    </table>

    <div class="divider"></div>

    <table class="totals-table">
        <tr class="font-bold total-amount">
            <td>TOTAL</td>
            <td class="text-right">Rp{{ number_format($transaction->total_amount, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td>Bayar</td>
            <td class="text-right">{{ strtoupper($transaction->payment_method) }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <div class="footer text-center">
        *** TERIMA KASIH ***<br>
        Barang yang sudah dibeli<br>
        tidak dapat ditukar/dikembalikan
    </div>
</body>
</html>
