// src/features/product/Reviews.jsx
const reviews = [
  {
    user: "Julianne Devis",
    initials: "JD",
    date: "NOVEMBER 12, 2023",
    content: "Exquisite. I haven't been this moved by a debut novel in years.",
    verified: true,
  },
  {
    user: "Marcus Reed",
    initials: "MR",
    date: "OCTOBER 28, 2023",
    content: "The imagery is stunning. Thorne writes with a painterly touch.",
    verified: true,
  },
];

export default function Reviews() {
  return (
    <section className="max-w-3xl mx-auto py-16">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-2xl font-serif">Reader Feedback </h3>
        <button className="text-xs uppercase tracking-widest font-bold border-b border-verse-dark pb-1">
          Write a Review
        </button>
      </div>

      <div className="space-y-12">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="flex gap-6 pb-12 border-b border-gray-100 last:border-0"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
              {rev.initials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <h4 className="text-sm font-bold">
                  {rev.user}{" "}
                  {rev.verified && (
                    <span className="text-[10px] text-gray-400 font-normal uppercase ml-2">
                      Verified Purchase
                    </span>
                  )}
                </h4>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {rev.date}
                </span>
              </div>
              <div className="text-verse-gold text-xs mb-4">
                ★★★★★
              </div>
              <p className="text-gray-600 leading-relaxed italic">
                "{rev.content}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
