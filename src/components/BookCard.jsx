// src/components/BookCard.jsx
export default function BookCard({ category, title, author, price, imageColor }) {
  return (
    <div className="group cursor-pointer">
      {/* Book Cover Placeholder */}
      <div className={`aspect-[2/3] w-full mb-4 overflow-hidden shadow-sm transition-shadow group-hover:shadow-xl ${imageColor || 'bg-gray-200'} flex items-end p-4`}>
        {/* Subtle label on the cover as seen in the PDF */}
        <span className="text-[10px] text-white/70 font-serif italic">{title}</span>
      </div>

      {/* Metadata */}
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          {category}
        </p>
        <h4 className="font-serif text-lg text-verse-dark group-hover:text-verse-gold transition-colors">
          {title}
        </h4>
        <p className="text-xs text-gray-500 italic">
          {author}
        </p>
        <p className="text-sm font-medium mt-2 text-verse-dark">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}