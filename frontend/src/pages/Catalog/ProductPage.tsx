import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../data/mockData';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; // fallback to first product if not found
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].name);

  // Get some recommendations excluding the current product
  const recommendations = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <main className="w-full max-w-max-width mx-auto px-margin-desktop space-y-16 py-12">
      {/* Product Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Product Visuals (Editorial & Product Shots) */}
        <div className="lg:col-span-7 space-y-gutter">
          {/* Hero Editorial Shot */}
          <div className="neo-extruded rounded-[32px] overflow-hidden aspect-[4/5] relative">
            <img className="w-full h-full object-cover" data-alt={product.name} src={product.image}/>
            {product.badge && (
              <div className="absolute bottom-8 left-8">
                <span className="bg-surface/80 backdrop-blur-md px-6 py-2 rounded-full font-label-md text-label-md neo-extruded-sm">
                  {product.badge}
                </span>
              </div>
            )}
          </div>
          {/* Secondary Detail Grid */}
          <div className="grid grid-cols-2 gap-gutter">
            <div className="neo-extruded rounded-[24px] overflow-hidden aspect-square">
              <img className="w-full h-full object-cover" data-alt="Detail shot 1" src={product.image}/>
            </div>
            <div className="neo-extruded rounded-[24px] overflow-hidden aspect-square">
              <img className="w-full h-full object-cover" data-alt="Detail shot 2" src={product.image}/>
            </div>
          </div>
        </div>

        {/* Product Information & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="neo-extruded p-8 rounded-[32px] space-y-6">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">{product.name}</h1>
              <p className="text-secondary font-bold text-headline-md font-headline-md">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center gap-4 py-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface neo-extruded overflow-hidden">
                    <img className="w-full h-full object-cover" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKiPDHU9kvQInh5BTHzsrf-qizJ7hJkOkWzW-Zx07Uhf12ni53hetQ62yGhoKxZisF4huqlDrKCEDFDoIdjj0seX1UGqVgemHFhHdSIyKsfA_bIGhIHtDQRGubFC1pT-cut7fGxetwO57n9TJiH_S6-FVoHrN9_JTZFl3V6NcZp2XqUEjevC88GbBr6x2i8CQLADHI7tcWCP5VOS-OoeUf0NhfStYHgMLdU7tnVZc0TP3ZLH8IO9IWtVSAOvMDFXVS_Svr79fiCjhn"/>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface neo-extruded overflow-hidden bg-surface-container flex items-center justify-center text-[10px] font-bold">
                    +42
                  </div>
                </div>
                <span className="text-label-sm font-label-sm text-on-surface-variant">Recommended by the Squad community</span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Select Size</label>
                <button className="text-label-sm font-label-sm text-secondary hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-4" id="size-selector">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn py-4 rounded-xl font-label-md text-label-md transition-all duration-200 ${
                      selectedSize === size
                        ? 'neo-recessed text-secondary font-bold'
                        : 'neo-extruded hover:neo-recessed text-on-surface'
                    }`} 
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Color: {selectedColor}</label>
              <div className="flex gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name ? 'neo-recessed-sm border-secondary' : 'neo-extruded-sm border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>

            {/* Add to Bag */}
            <button 
              onClick={handleAddToCart}
              className="w-full py-6 rounded-2xl neo-extruded bg-secondary text-on-secondary font-headline-md text-headline-md hover:shadow-none active:neo-recessed transition-all duration-300 flex items-center justify-center gap-3 mt-4 group"
            >
              <span className="material-symbols-outlined group-active:translate-y-1 transition-transform">shopping_bag</span>
              Add to Bag
            </button>

            <div className="flex justify-between pt-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <span className="text-label-sm font-label-sm">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span className="text-label-sm font-label-sm">Lifetime Guarantee</span>
              </div>
            </div>
          </div>

          {/* Product Features Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="neo-extruded p-6 rounded-[24px] space-y-2">
              <span className="material-symbols-outlined text-secondary">architecture</span>
              <h4 className="font-label-md text-label-md font-bold">Structural Fit</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Double-lined hood and reinforced seams.</p>
            </div>
            <div className="neo-extruded p-6 rounded-[24px] space-y-2">
              <span className="material-symbols-outlined text-secondary">eco</span>
              <h4 className="font-label-md text-label-md font-bold">100% Organic</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Sustainably sourced technical material.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <section className="mt-24 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <h2 className="font-headline-lg text-headline-lg">Complete the Look</h2>
            <p className="text-on-surface-variant">Curated pairings for your new staple.</p>
          </div>
          <div className="flex gap-4">
            <button className="p-4 rounded-full neo-extruded hover:neo-recessed active:neo-recessed transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="p-4 rounded-full neo-extruded hover:neo-recessed active:neo-recessed transition-all">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {recommendations.map(rec => (
            <Link to={`/catalog/${rec.id}`} key={rec.id} className="group cursor-pointer block">
              <div className="neo-extruded rounded-[24px] overflow-hidden aspect-[3/4] mb-4 relative">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt={rec.name} src={rec.image}/>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // prevent link navigation
                    addToCart({
                      productId: rec.id,
                      name: rec.name,
                      price: rec.price,
                      quantity: 1
                    });
                  }}
                  className="absolute top-4 right-4 p-3 rounded-full bg-surface/40 backdrop-blur-md neo-extruded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <h3 className="font-label-md text-label-md font-bold mb-1">{rec.name}</h3>
              <p className="text-on-surface-variant text-label-sm font-label-sm">${rec.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
};
