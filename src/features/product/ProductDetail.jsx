// src/features/product/ProductDetail.jsx
export default function ProductDetail() {
  return (
    <section className="grid md:grid-cols-2 gap-16 mb-24">
      {/* Product Image Section */}
      <div className="flex flex-col items-center">
        <div className="w-full aspect-[3/4] bg-verse-dark flex items-center justify-center shadow-2xl mb-8 group overflow-hidden">
          {/* Placeholder for the dark cover with gold leaf */}
          <div className="text-center p-12 border border-verse-gold/30">
            <div className="text-verse-gold text-4xl mb-6">🪶</div>
            <h3 className="text-verse-gold font-serif text-2xl tracking-widest uppercase">
              The Echoes of Silence
            </h3>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-gray-200 text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">
            Look Inside
          </button>
          <button className="px-6 py-2 border border-gray-200 text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">
            Wishlist
          </button>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col justify-center">
        <nav className="text-[10px] uppercase tracking-widest text-gray-400 mb-6">
          Catalog / Historical Fiction / The Echoes of Silence
        </nav>

        <h1 className="text-4xl md:text-5xl font-serif text-verse-dark mb-2">
          The Echoes of Silence
        </h1>
        <p className="text-gray-500 italic mb-6">
          by Evelyn Thorne — 4.8 (1.2k Reviews)
        </p>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-2xl font-medium text-verse-dark">
            $32.50
          </span>
          <span className="text-gray-400 line-through text-sm">
            $45.00
          </span>
          <span className="bg-verse-gold/10 text-verse-gold text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
            Save 30%
          </span>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          In the heart of post-war London, a hidden manuscript unearths a series
          of letters that could rewrite history. Thorne’s masterful
          prose guides us through a labyrinth of forgotten memories.
        </p>

        <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100 mb-8">
          <div>
            <p className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">
              Format
            </p>
            <p className="text-sm font-medium">Hardcover</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">
              Pages
            </p>
            <p className="text-sm font-medium">432</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-verse-dark text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors">
            Add to Cart
          </button>
          <button className="flex-1 border border-verse-dark py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-verse-cream transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}
