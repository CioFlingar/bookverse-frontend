export default function Hero() {
  return (
    <section className="bg-white text-slate-800 rounded-sm overflow-hidden mb-16 ">
      <div className="grid md:grid-cols-2 gap-8 items-center px-10 py-10 md:py-10">
        {/* Text Content */}
        <div className="max-w-md">
          <span className="text-xs uppercase tracking-[0.2em] text-red-400 mb-4 block">
            Book of the Month ---
          </span>
          <h2 className="text-3xl font-bold md:text-3xl font-serif mb-6 leading-tight">
            The Silent Archival of <br /> Lost Echoes
          </h2>
          <p className="text-sm text-slate-500 tracking-widest mb-4 italic">
            by Elena Sterling
          </p>
          <p className="mb-8 leading-relaxed">
            "A hauntingly beautiful exploration of memory and the objects we leave behind. Sterling's latest
            masterpiece redefined the contemporary literacy landscape this season."
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-slate-800 text-white text-xs uppercase tracking-widest
            font-bold hover:bg-slate-500 transition-colors cursor-pointer">
              Explore the Title
            </button>
            <button className="px-8 py-3 border border-slate-500 text-xs uppercase tracking-widest font-bold
             hover:bg-slate-500 transition-colors cursor-pointer">
              Add to Wishlist
            </button>
          </div>
        </div>

        {/* Featured Image Overlay */}
        <div className="relative flex justify-center">
          {/* Main Book Cover Placeholder */}
          <div className="w-54 h-76 bg-gradient-to-br from-verse-gold/20 to-transparent border
        border-white/10 shadow-2xl flex items-center justify-center relative z-10">
            {/* <div className="text-verse-gold font-serif text-center p-4"> */}
              {/* <div className="text-3xl opacity-50">✦</div> */}
              {/* <img className="mt-4 text-sm tracking-widest uppercase">Sterling</img> */}
              <img src="../../public/images/hero.jpg" alt="hero image" className="w-54 h-76 mix-blend-multiply"/>
            {/* </div> */}
          </div>
          {/* Decorative background element for that "abstract gold" feel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-verse-gold/10
          rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}
