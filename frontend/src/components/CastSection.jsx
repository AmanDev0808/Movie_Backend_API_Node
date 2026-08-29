import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';

// Known character roles lookup
const actorCharacterMap = {
  "leonardo dicaprio": "Dom Cobb",
  "joseph gordon-levitt": "Arthur",
  "elliot page": "Ariadne",
  "tom hardy": "Eames",
  "ken watanabe": "Saito",
  "cillian murphy": "Robert Fischer",
  "marion cotillard": "Mal Cobb",
  "michael caine": "Stephen Miles",
  "christian bale": "Bruce Wayne / Batman",
  "heath ledger": "Joker",
  "aaron eckhart": "Harvey Dent",
  "maggie gyllenhaal": "Rachel Dawes",
  "gary oldman": "James Gordon",
  "morgan freeman": "Lucius Fox",
  "matthew mcconaughey": "Cooper",
  "anne hathaway": "Brand",
  "jessica chastain": "Murph",
  "mackenzie foy": "Young Murph",
  "casey affleck": "Tom",
  "john lithgow": "Donald",
  "timothée chalamet": "Paul Atreides",
  "zendaya": "Chani",
  "rebecca ferguson": "Lady Jessica",
  "josh brolin": "Gurney Halleck",
  "austin butler": "Feyd-Rautha",
  "florence pugh": "Princess Irulan",
  "dave bautista": "Beast Rabban",
  "javier bardem": "Stilgar",
  "sam worthington": "Jake Sully",
  "zoe saldana": "Neytiri",
  "sigourney weaver": "Kiri",
  "kate winslet": "Ronal",
  "shameik moore": "Miles Morales",
  "jake johnson": "Peter B. Parker",
  "hailee steinfeld": "Gwen Stacy",
  "mahershala ali": "Uncle Aaron"
};

// Known actor profile images lookup (using high quality curated portraits)
const actorImageMap = {
  "robert downey jr.": "https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg",
  "chris evans": "https://image.tmdb.org/t/p/w185/3bOGNsHlrswhyW79uvIHH1V43JI.jpg",
  "scarlett johansson": "https://image.tmdb.org/t/p/w185/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg",
  "mark ruffalo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Mark_Ruffalo_%2836201774756%29_%28cropped%29.jpg/330px-Mark_Ruffalo_%2836201774756%29_%28cropped%29.jpg",
  "cillian murphy": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg/330px-Cillian_Murphy_at_the_London_premier_of_Steve_in_September_2025_%28cropped%29.jpg",
  "emily blunt": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Emily_Blunt_at_WWD_Style_Awards_2026-02.jpg/330px-Emily_Blunt_at_WWD_Style_Awards_2026-02.jpg",
  "matt damon": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/MattDamon-byPhilipRomano2.jpg/330px-MattDamon-byPhilipRomano2.jpg",
  "matthew mcconaughey": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%28Cropped%29.jpg/330px-Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%28Cropped%29.jpg",
  "anne hathaway": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Anne_Hathaway-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194764955_%28cropped%29.jpg/330px-Anne_Hathaway-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194764955_%28cropped%29.jpg",
  "jessica chastain": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Jessica_Chastain-64631_%28cropped%29.jpg/330px-Jessica_Chastain-64631_%28cropped%29.jpg",
  "michael caine": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Michael_Caine_-_Viennale_2012_g_%28cropped%29.jpg/330px-Michael_Caine_-_Viennale_2012_g_%28cropped%29.jpg",
  "tom holland": "https://image.tmdb.org/t/p/w185/bBRlrpJm9XkNSg0ytQt8s3h1YQ0.jpg",
  "benedict cumberbatch": "https://image.tmdb.org/t/p/w185/fBEucxECxGLKVHBznO8PqZ1x0aS.jpg",
};

const ActorImage = ({ src, name }) => {
  const [imageUrl, setImageUrl] = useState(src || '');
  const [loading, setLoading] = useState(!src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (src) return undefined;

    const controller = new AbortController();
    const pageName = encodeURIComponent(name.replace(/\s+/g, '_'));
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageName}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        const thumbnail = data?.thumbnail?.source;
        if (thumbnail) setImageUrl(thumbnail);
        else setFailed(true);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [name, src]);

  if (loading) {
    return <div className="h-full w-full animate-pulse bg-white/10" aria-label={`Loading photo of ${name}`} />;
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d0d11&color=ffffff&size=240`;

  if (!imageUrl || failed) {
    return (
      <img
        src={fallbackAvatar}
        alt={name}
        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
      loading="lazy"
    />
  );
};

const CastSection = ({ casts = [] }) => {
  if (!casts || casts.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black tracking-tight uppercase">
          Meet The <span className="text-red-500">Cast</span>
        </h2>
      </div>

      {/* Grid for desktop, Horizontal Scroll for mobile */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex gap-6 overflow-x-auto pb-4 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-x-visible lg:pb-0"
      >
        {casts.map((actor, index) => {
          const actorName = typeof actor === 'string' ? actor : actor.name;
          const lowerName = actorName.toLowerCase().trim();
          const charName = typeof actor === 'object' && actor.character
            ? actor.character
            : actorCharacterMap[lowerName] || "Actor";
          const imageUrl = typeof actor === 'object' && actor.image
            ? actor.image
            : actorImageMap[lowerName];

          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="flex flex-col items-center p-5 rounded-[2rem] glass-panel w-[160px] shrink-0 text-center select-none relative group border border-white/5 shadow-lg"
            >
              {/* Profile Image / Initials Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 relative flex items-center justify-center border border-white/10 group-hover:border-red-500/50 shadow-inner group-hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] transition-all duration-300">
                <ActorImage src={imageUrl} name={actorName} />
                {/* Overlay shadow */}
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>

              {/* Text Names */}
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white group-hover:text-red-500 transition-colors duration-300 line-clamp-1" aria-label={`Actor: ${actorName}`}>
                  {actorName}
                </h4>
                <p className="text-xs font-medium text-white/40 line-clamp-1 italic" aria-label={`Character: ${charName}`}>
                  {charName}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default CastSection;
