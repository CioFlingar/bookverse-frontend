import { Link } from "react-router-dom";

export default function BookCard({ id, category, title, author, price, imageColor }) {
  return (
    <Link to={`/product/${id}`} className="group cursor-pointer">
      <div className={`aspect-[2/3] w-full mb-4 overflow-hidden shadow-sm transition-shadow group-hover:shadow-xl ${imageColor || 'bg-gray-200'} flex items-end p-4`}>
        <span className="text-[10px] text-white/70 font-serif italic">{title}</span>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{category}</p>
        <h4 className="font-serif text-lg text-verse-dark group-hover:text-verse-gold transition-colors">{title}</h4>
        <p className="text-xs text-gray-500 italic">{author}</p>
        <p className="text-sm font-medium mt-2 text-verse-dark">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
