export default function Hero() {
  return (
    <section className="bg-verse-dark text-white rounded-sm overflow-hidden mb-16">
      <div className="grid md:grid-cols-2 gap-8 items-center px-10 py-16 md:py-24">
        {/* Text Content */}
        <div className="max-w-md">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 block">
            Book of the Month
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            The Silent Archival of <br /> Lost Echoes [cite: 5]
          </h2>
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">
            by Elena Sterling [cite: 6]
          </p>
          <p className="text-gray-300 mb-8 leading-relaxed italic">
            "A hauntingly beautiful exploration of memory and the objects we
            leave behind." [cite: 7]
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-white text-verse-dark text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors">
              Explore the Title [cite: 9]
            </button>
            <button className="px-8 py-3 border border-gray-600 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors">
              Add to Wishlist [cite: 10]
            </button>
          </div>
        </div>

        {/* Featured Image Overlay */}
        <div className="relative flex justify-center">
          {/* Main Book Cover Placeholder */}
          <div className="w-64 h-96 bg-gradient-to-br from-verse-gold/20 to-transparent border border-white/10 shadow-2xl flex items-center justify-center relative z-10">
            <div className="text-verse-gold font-serif text-center p-4">
              <div className="text-3xl opacity-50">✦</div>
              <p className="mt-4 text-sm tracking-widest uppercase">Sterling</p>
            </div>
          </div>
          {/* Decorative background element for that "abstract gold" feel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-verse-gold/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
