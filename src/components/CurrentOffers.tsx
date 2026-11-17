import React, { useState } from 'react';
import { Tag, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

interface CurrentOffersProps {
  onApplyPromo: (code: string) => void;
  onBookNow: (category?: string) => void;
}

export const CurrentOffers: React.FC<CurrentOffersProps> = ({
  onApplyPromo,
  onBookNow,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onApplyPromo(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const offers = [
    {
      id: 'offer-1',
      badge: 'FALL SAVINGS',
      title: 'Save 15% On Total Rates',
      description: 'Embrace the season with warm savings on your next stay.',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80',
      promoCode: 'FALL15',
      primaryAction: 'Book Now',
      hasCode: true,
      category: 'car',
    },
    {
      id: 'offer-2',
      badge: 'TRUCK & VAN RENTALS',
      title: 'Trucks & Vans: 15% Off',
      description: 'Flexible cargo and passenger solutions for work and travel.',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
      promoCode: 'MOVE15',
      primaryAction: 'Book Now',
      hasCode: true,
      category: 'suv',
    },
    {
      id: 'offer-3',
      badge: 'PACK. BOOK. GO.',
      title: 'Last Minute Deals',
      description: 'Great rates when plans happen fast.',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80',
      primaryAction: 'See Last Minute Deals',
      hasCode: false,
      category: 'available',
    },
  ];

  return (
    <section id="offers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="mb-10 text-left">
        <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-orange-500 mb-2">
          <Tag className="w-4 h-4 fill-orange-500/20" />
          <span>CURRENT OFFERS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight leading-tight">
          Deals made for your next trip
        </h2>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Limited-time deals to get you on the road for less.
        </p>
      </div>

      {/* 3 Offer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="group relative rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-7 shadow-xl border border-neutral-200/80 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            {/* Background Image with Zoom on Hover */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 space-y-3.5">
              {/* Orange Pill Tag */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                  {offer.badge === 'PACK. BOOK. GO.' && <Sparkles className="w-3 h-3" />}
                  {offer.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {offer.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 font-normal leading-relaxed">
                {offer.description}
              </p>

              {/* Action Buttons Row */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {/* Primary Button */}
                <button
                  onClick={() => onBookNow(offer.category)}
                  className="px-5 py-2.5 min-h-[44px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-orange-500/30 flex items-center gap-1.5 transition-all active:scale-95 group/btn"
                >
                  <span>{offer.primaryAction}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                {/* Promo Code Copy Pill */}
                {offer.hasCode && offer.promoCode && (
                  <button
                    onClick={() => handleCopyCode(offer.promoCode!)}
                    className="px-4 py-2.5 min-h-[44px] rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs tracking-wider border border-white/20 flex items-center gap-1.5 transition-all hover:border-orange-500/70"
                    title="Tap to copy and apply discount"
                  >
                    {copiedCode === offer.promoCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-300" />
                        <span>{offer.promoCode}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
