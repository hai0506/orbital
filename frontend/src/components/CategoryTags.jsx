const CategoryTags = ({ categories }) => {
  
  const Badge = ({ children, color = "gray" }) => {
    const colors = {
      orange: "bg-orange-100 text-orange-800",
      pink: "bg-pink-100 text-pink-800",
      sky: "bg-sky-100 text-sky-800",
      violet: "bg-violet-100 text-violet-800",
      yellow: "bg-yellow-100 text-yellow-800",
      indigo: "bg-indigo-100 text-indigo-800",
      amber: "bg-amber-100 text-amber-800",
      rose: "bg-rose-100 text-rose-800",
      cyan: "bg-cyan-100 text-cyan-800",
      fuchsia: "bg-fuchsia-100 text-fuchsia-800",
      green: "bg-green-100 text-green-800",
      lime: "bg-lime-100 text-lime-800",
      gray: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors[color]}`}
      >
        {children}
      </span>
    );
  };

  const categoryColors = {
    "Food & Beverages": "orange",
    "Accessories": "pink",
    "Stationery": "sky",
    "Clothing": "violet",
    "Toys": "yellow",
    "Books": "indigo",
    "Home Decor": "amber",
    "Art & Crafts": "rose",
    "Tech Gadgets": "cyan",
    "Skincare & Beauty": "fuchsia",
    "Plants": "green",
    "Pet Supplies": "lime",
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <Badge key={category} color={categoryColors[category] || "gray"}>
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryTags;

