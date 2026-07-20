
export const AboutPage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-12 py-12">
      <div className="neo-extruded p-6 lg:p-10 rounded-[40px] bg-surface space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">About Squad Wear</h1>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-3xl">
            Engineered for the urban environment. Our mission is to fuse high-performance technical fabrics with streetwear silhouettes designed for absolute movement and utility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">Our Story</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              Born from the necessity of functional everyday wear, Squad Wear began as an experimental project to create garments that could withstand both harsh weather conditions and the aesthetic demands of modern street culture.
            </p>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We source proprietary materials and partner with state-of-the-art manufacturing facilities to ensure every seam, zipper, and pocket serves a distinct purpose.
            </p>
          </div>

          <div className="neo-recessed rounded-3xl p-6 lg:p-8 bg-surface-container-low space-y-4">
            <h2 className="font-headline-md text-headline-md text-on-surface">B2B & Custom Orders</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">
              We provide customized tactical gear and streetwear for teams, corporate clients, and specialized crews. Connect with our dedicated B2B team to discuss your specific requirements.
            </p>
            <div className="pt-4">
              <button className="neo-extruded-sm neo-interactive px-6 py-3 rounded-xl font-label-md text-label-md bg-on-surface text-surface font-bold">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
