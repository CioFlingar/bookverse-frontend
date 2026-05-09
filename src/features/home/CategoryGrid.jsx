// src/features/home/CategoryGrid.jsx
const categories = [
  { name: 'Fiction', count: '1,240 Titles', id: 12 },
  { name: 'Philosophy', count: '430 Titles', id: 15 },
  { name: 'Poetry & Letters', count: '315 Titles', id: 16 },
  { name: 'History', count: '842 Titles', id: 17 },
];

export default function CategoryGrid() {
  return (
    <div className="mb-20">
      <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-8 border-b pb-4">
        Popular Categories
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="group cursor-pointer border border-gray-200 p-6 hover:bg-verse-dark hover:text-white transition-all">
            <h4 className="font-serif text-xl mb-1">{cat.name}</h4>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-verse-gold">
              {cat.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}