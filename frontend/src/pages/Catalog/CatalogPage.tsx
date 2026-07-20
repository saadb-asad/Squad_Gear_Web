import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';

export const CatalogPage = () => {
  const { addToCart } = useCart();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Outerwear', 'T-Shirts']);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(250);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const filteredProducts = PRODUCTS.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedSize && !product.sizes.includes(selectedSize)) return false;
    if (selectedColor && !product.colors.some(c => c.name === selectedColor)) return false;
    if (product.price > priceRange) return false;
    return true;
  });

  return (
    <main className="w-full max-w-max-width mx-auto px-margin-desktop space-y-12 py-12">
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-28 space-y-10">
            <div>
              <h3 className="font-headline-md text-headline-md mb-6 text-on-surface">Filters</h3>
              
              {/* Category Filter */}
              <section className="mb-8">
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-outline mb-4">Category</h4>
                <div className="space-y-3">
                  {['Outerwear', 'T-Shirts', 'Accessories', 'Footwear'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-6 h-6 neo-recessed rounded-lg flex items-center justify-center transition-all group-hover:shadow-none">
                        <div className={`w-3 h-3 bg-secondary rounded-sm transition-opacity ${selectedCategories.includes(cat) ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                      <span className={`font-body-md text-body-md ${selectedCategories.includes(cat) ? 'text-secondary font-semibold' : ''}`}>{cat}</span>
                      <input 
                        className="hidden"  
                        type="checkbox" 
                        checked={selectedCategories.includes(cat)} 
                        onChange={() => handleCategoryToggle(cat)} 
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Size Filter */}
              <section className="mb-8">
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-outline mb-4">Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`py-2 rounded-lg font-label-md text-label-md transition-all ${
                        selectedSize === size 
                          ? 'neo-recessed text-secondary font-bold' 
                          : 'neo-extruded text-on-surface hover:neo-recessed'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Filter */}
              <section className="mb-8">
                <h4 className="font-label-md text-label-md uppercase tracking-widest text-outline mb-4">Color</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Midnight Black', color: 'bg-on-surface' },
                    { name: 'Teal Green', color: 'bg-secondary' },
                    { name: 'Industrial Grey', color: 'bg-outline' },
                    { name: 'Off-White', color: 'bg-surface-container-highest' },
                  ].map(c => (
                    <button 
                      key={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                      className={`w-8 h-8 rounded-full ${c.color} neo-extruded border-2 border-surface transition-all ${
                        selectedColor === c.name ? 'ring-2 ring-secondary' : ''
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </section>

              {/* Price Filter */}
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-label-md text-label-md uppercase tracking-widest text-outline">Price</h4>
                  <span className="text-secondary font-bold text-label-md">$40 - ${priceRange}</span>
                </div>
                <div className="px-2">
                  <input 
                    className="w-full" 
                    max="500" 
                    min="40" 
                    type="range" 
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                  />
                </div>
              </section>
            </div>
            <button 
              onClick={() => {
                setSelectedCategories([]);
                setSelectedSize(null);
                setSelectedColor(null);
                setPriceRange(500);
              }}
              className="w-full py-4 rounded-xl neo-extruded font-headline-md text-headline-md text-secondary neo-pressed active:text-on-secondary active:bg-secondary transition-all"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-10">
            <p className="font-body-md text-body-md text-on-surface-variant">Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> technical pieces</p>
            <div className="relative">
              <button className="neo-extruded px-6 py-3 rounded-xl flex items-center gap-3 font-label-md text-label-md">
                Sort by: Featured
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map(product => (
              <div key={product.id} className="neo-extruded p-4 rounded-3xl group transition-transform hover:-translate-y-2 flex flex-col">
                <Link to={`/catalog/${product.id}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 neo-recessed">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                    style={{backgroundImage: `url('${product.image}')`}}
                  ></div>
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={(e) => { e.preventDefault(); /* simulate favorite */ }}
                      className="w-10 h-10 neo-extruded rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </button>
                  </div>
                  {product.badge && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-secondary text-on-secondary text-label-sm font-label-sm px-3 py-1 rounded-full uppercase tracking-widest">{product.badge}</span>
                    </div>
                  )}
                </Link>
                <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                  <div>
                    <Link to={`/catalog/${product.id}`}>
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-1 hover:text-secondary transition-colors">{product.name}</h3>
                    </Link>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">{product.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-secondary">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1
                      })}
                      className="neo-extruded p-3 rounded-xl hover:bg-secondary hover:text-on-secondary transition-all"
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-4">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="neo-extruded w-12 h-12 rounded-xl flex items-center justify-center text-outline hover:text-secondary transition-all"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
                  currentPage === page 
                    ? 'neo-recessed text-secondary' 
                    : 'neo-extruded text-on-surface hover:neo-recessed'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="neo-extruded w-12 h-12 rounded-xl flex items-center justify-center text-outline hover:text-secondary transition-all"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
