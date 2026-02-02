import { useState } from "react";

type Item = {
  name: string;
  stock: number;
};

type StockCheckProps = {
  items: Item[];
};

export default function StockCheck({ items }: StockCheckProps) {
  const [query, setQuery] = useState("");

  const searchLower = query.toLowerCase();

  const found = items.find((item) =>
    item.name.toLowerCase().includes(searchLower)
  );

  return (
    <div>
      <h2>Cek Stok</h2>

      <input
        type="text"
        placeholder="Cari barang..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <p>
          {found
            ? `Stok ${found.name}: ${found.stock}`
            : "Barang tidak ditemukan"}
        </p>
      )}
    </div>
  );
}
