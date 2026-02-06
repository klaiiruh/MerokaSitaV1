import React, { useState, useEffect } from 'react';

// Main App Component
export default function MerokaWebsite() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
      
      const sectionHeight = window.innerHeight;
      const currentSection = Math.floor(scrollTop / (sectionHeight * 0.95));
      setActiveSection(Math.min(currentSection, 6));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic background color based on scroll
  const getBgColor = () => {
    const colors = [
      'from-slate-950 via-slate-900 to-slate-950',
      'from-slate-900 via-slate-800 to-slate-900',
      'from-slate-800 via-teal-900 to-slate-800',
      'from-teal-900 via-emerald-800 to-teal-900',
      'from-emerald-800 via-teal-700 to-amber-900',
      'from-teal-700 via-amber-700 to-orange-700',
      'from-amber-600 via-orange-500 to-amber-400',
    ];
    return colors[Math.min(activeSection, colors.length - 1)];
  };

  if (activeTab !== 'home') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'basecamp' && <BaseCampPage />}
        {activeTab === 'expedition' && <ExpeditionPage />}
        {activeTab === 'join' && <JoinPage />}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBgColor()} transition-all duration-1000`}>
      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} scrollProgress={scrollProgress} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800/50 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Scroll Sections */}
      <Section1 active={activeSection === 0} />
      <Section2 active={activeSection === 1} />
      <Section3 active={activeSection === 2} />
      <Section4 active={activeSection === 3} />
      <Section5 active={activeSection === 4} />
      <Section6 active={activeSection === 5} />
      <Section7 active={activeSection === 6} setActiveTab={setActiveTab} />

      {/* Floating Mountain Illustration */}
      <MountainIllustration progress={scrollProgress} />
    </div>
  );
}

// Navigation Component
function Navigation({ activeTab, setActiveTab, scrollProgress = 0, mobileMenuOpen, setMobileMenuOpen }) {
  const isHome = activeTab === 'home';
  const bgOpacity = isHome ? Math.min(scrollProgress * 2, 0.9) : 0.95;
  
  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isHome ? 'py-6' : 'py-4'}`}
      style={{ backgroundColor: `rgba(15, 23, 42, ${bgOpacity})` }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('home')}
          className="text-2xl font-bold text-white tracking-tight hover:text-amber-400 transition-colors"
        >
          MEROKA
          <span className="text-amber-400">.</span>
        </button>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['home', 'about', 'basecamp', 'expedition'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab === 'basecamp' ? 'Base Camp' : tab === 'expedition' ? 'Expedition' : tab}
            </button>
          ))}
          <button 
            onClick={() => setActiveTab('join')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
          >
            Join the Expedition
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-sm py-4">
          {['home', 'about', 'basecamp', 'expedition'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-6 py-3 text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'text-amber-400 bg-slate-800/50' : 'text-slate-300'
              }`}
            >
              {tab === 'basecamp' ? 'Base Camp' : tab === 'expedition' ? 'Expedition' : tab}
            </button>
          ))}
          <div className="px-6 pt-3">
            <button 
              onClick={() => { setActiveTab('join'); setMobileMenuOpen(false); }}
              className="w-full px-4 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg text-sm"
            >
              Join the Expedition
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Mountain Illustration that evolves
function MountainIllustration({ progress }) {
  const trailsVisible = progress > 0.15;
  const moreTrailsVisible = progress > 0.3;
  const firesVisible = progress > 0.4;
  const figuresVisible = progress > 0.5;
  const beaconVisible = progress > 0.7;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Stars */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${progress > 0.5 ? 'opacity-0' : 'opacity-100'}`}>
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.2 + Math.random() * 0.6
            }}
          />
        ))}
      </div>

      {/* Mountain Silhouette */}
      <svg 
        className="absolute bottom-0 w-full h-3/4 transition-all duration-1000"
        viewBox="0 0 1200 600" 
        preserveAspectRatio="xMidYMax slice"
        style={{ transform: `translateY(${progress * 50}px)` }}
      >
        {/* Back Mountain */}
        <path
          d="M0 600 L200 300 L400 450 L600 200 L800 400 L1000 250 L1200 600 Z"
          className={`transition-all duration-1000 ${progress > 0.4 ? 'fill-emerald-800/40' : 'fill-slate-800/60'}`}
        />
        
        {/* Main Mountain */}
        <path
          d="M0 600 L300 350 L500 500 L700 180 L900 450 L1100 300 L1200 600 Z"
          className={`transition-all duration-1000 ${progress > 0.4 ? 'fill-emerald-700/50' : 'fill-slate-700/70'}`}
        />

        {/* Front Mountain */}
        <path
          d="M0 600 L150 450 L350 550 L550 380 L750 520 L950 400 L1200 600 Z"
          className={`transition-all duration-1000 ${progress > 0.4 ? 'fill-teal-800/60' : 'fill-slate-600/50'}`}
        />

        {/* Single faint trail at start */}
        <path
          d="M600 600 Q650 500 700 420 Q720 380 700 350 Q680 300 700 250 Q720 200 700 180"
          fill="none"
          stroke={progress > 0.15 ? "rgba(251, 191, 36, 0.6)" : "rgba(100, 116, 139, 0.3)"}
          strokeWidth="3"
          strokeDasharray="10,5"
          className="transition-all duration-1000"
        />

        {/* More Trails appear */}
        {trailsVisible && (
          <g className="animate-fade-in">
            <path
              d="M400 600 Q450 520 500 480 Q550 420 520 380 Q500 340 530 300"
              fill="none"
              stroke="rgba(251, 191, 36, 0.4)"
              strokeWidth="2"
              strokeDasharray="8,4"
            />
            <path
              d="M800 600 Q820 520 850 460 Q900 400 880 350 Q860 300 900 260"
              fill="none"
              stroke="rgba(251, 191, 36, 0.4)"
              strokeWidth="2"
              strokeDasharray="8,4"
            />
          </g>
        )}

        {/* Even more trails */}
        {moreTrailsVisible && (
          <g className="animate-fade-in">
            <path
              d="M300 600 Q350 500 400 450 Q450 400 420 350"
              fill="none"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M950 600 Q980 520 1000 450 Q1020 380 980 320"
              fill="none"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <path
              d="M550 450 Q600 400 650 380 Q700 360 720 320"
              fill="none"
              stroke="rgba(251, 191, 36, 0.35)"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
          </g>
        )}

        {/* Campfires */}
        {firesVisible && (
          <g>
            <circle cx="530" cy="300" r="8" className="fill-orange-400 animate-pulse" />
            <circle cx="530" cy="300" r="15" className="fill-orange-400/30 animate-ping" />
            
            <circle cx="700" cy="250" r="6" className="fill-amber-400 animate-pulse" />
            <circle cx="700" cy="250" r="12" className="fill-amber-400/30 animate-ping" style={{ animationDelay: '0.5s' }} />
            
            <circle cx="880" cy="350" r="7" className="fill-orange-300 animate-pulse" />
            <circle cx="880" cy="350" r="14" className="fill-orange-300/30 animate-ping" style={{ animationDelay: '1s' }} />

            <circle cx="420" cy="350" r="5" className="fill-amber-300 animate-pulse" />
            <circle cx="420" cy="350" r="10" className="fill-amber-300/30 animate-ping" style={{ animationDelay: '0.7s' }} />
          </g>
        )}

        {/* Figures */}
        {figuresVisible && (
          <g className="animate-fade-in">
            {[
              { x: 520, y: 310 },
              { x: 540, y: 308 },
              { x: 535, y: 315 },
              { x: 690, y: 260 },
              { x: 710, y: 258 },
              { x: 705, y: 262 },
              { x: 695, y: 265 },
              { x: 870, y: 360 },
              { x: 890, y: 358 },
              { x: 885, y: 365 },
              { x: 410, y: 360 },
              { x: 430, y: 358 },
              { x: 650, y: 400 },
              { x: 670, y: 398 },
              { x: 750, y: 380 },
              { x: 600, y: 450 },
              { x: 620, y: 448 },
              { x: 500, y: 420 },
            ].map((pos, i) => (
              <g key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                <circle cx={pos.x} cy={pos.y - 8} r="4" className="fill-slate-200" />
                <path d={`M${pos.x} ${pos.y - 4} L${pos.x} ${pos.y + 8}`} stroke="#e2e8f0" strokeWidth="2" />
              </g>
            ))}
          </g>
        )}

        {/* Beacon at Summit */}
        {beaconVisible && (
          <g className="animate-fade-in">
            <circle cx="700" cy="180" r="25" className="fill-amber-400/40 animate-ping" />
            <circle cx="700" cy="180" r="15" className="fill-amber-300/60 animate-pulse" />
            <circle cx="700" cy="180" r="8" className="fill-white" />
          </g>
        )}
      </svg>

      {/* Sun/Moon transition */}
      <div 
        className={`absolute w-32 h-32 rounded-full transition-all duration-1000 ${
          progress > 0.5 
            ? 'bg-gradient-to-br from-amber-300 to-orange-400 top-20 right-1/4 opacity-80' 
            : 'bg-gradient-to-br from-slate-400 to-slate-500 top-32 right-1/3 opacity-20'
        }`}
        style={{ 
          filter: progress > 0.5 ? 'blur(20px)' : 'blur(10px)',
          transform: `translateY(${-progress * 100}px)`
        }}
      />
    </div>
  );
}

// Section 1: The Hook + Mission
function Section1({ active }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`text-center max-w-4xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          We're mapping a new healthcare system.
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 mb-8">
          But we need healthcare workers to help draw the trails.
        </p>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto opacity-0 animate-fade-in-delay">
          Meroka is building a collective of independent physicians redrawing how healthcare works.
        </p>
        <div className="mt-16 flex flex-col items-center gap-2 text-slate-500">
          <span className="text-sm">Begin the climb</span>
          <div className="animate-bounce">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 2: The Old Map (The Problem)
function Section2({ active }) {
  const stats = [
    { value: '78%', label: 'of physicians now employed by hospitals or corporate entities' },
    { value: '1 in 4', label: 'physician practices owned by private equity' },
    { value: '7 yrs', label: 'average lifespan of an independent practice before selling' },
    { value: '340%', label: 'increase in administrative burden since 2000' },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`max-w-4xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-700/50 relative overflow-hidden">
          {/* Old map texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-900 to-transparent"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <span className="text-slate-500 text-sm uppercase tracking-wider">The Old Map</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
              The old map has one trail.<br />
              <span className="text-slate-400">Consolidate. Fall in line. Let PE lead the way.</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="text-lg text-slate-300">
              Insurance gatekeeping. PE rollups. Burnout dressed up as "efficiency."
              <span className="block mt-2 text-slate-400">That's the path they drew for you.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 3: The Reframe
function Section3({ active }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`text-center max-w-4xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-2xl md:text-3xl text-slate-300 mb-8">
          But that's just one path.
        </p>
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-12">
          At Meroka, we see a mountain full of trails{' '}
          <span className="text-amber-400">nobody bothered to map.</span>
        </h2>
        <p className="text-xl md:text-2xl text-teal-200 italic font-light">
          "Who said getting to the summit couldn't be the adventure?"
        </p>
      </div>
    </section>
  );
}

// Section 4: The Secret (Collective Power)
function Section4({ active }) {
  const cards = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
      title: 'Trails you didn\'t notice',
      description: 'Paths to practicing on your own terms, however that looks for you.'
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: 'Gear you couldn\'t carry alone',
      description: 'Tools and tech that used to require a whole system behind you. Now shared across the crew.'
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      title: 'Crew that has your back',
      description: 'Fellow explorers who\'ve been where you\'re headed. Advice, support, and a seat by the fire.'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`max-w-5xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-xl md:text-2xl text-slate-200 text-center mb-4 max-w-3xl mx-auto">
          The old map was drawn by a few people who never climbed it.
        </p>
        <p className="text-xl md:text-2xl text-amber-300 text-center mb-12 max-w-3xl mx-auto">
          This one gets drawn by everyone on the trail.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all group"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-slate-300">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 5: The Math
function Section5({ active }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`max-w-4xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="space-y-12">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-lg mb-2">One physician on the mountain?</p>
            <p className="text-2xl md:text-3xl text-slate-300">You'll walk the same trails everyone else did.</p>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-lg mb-2">Ten?</p>
            <p className="text-3xl md:text-4xl text-white font-semibold">Now you're finding shortcuts.</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-slate-400 text-lg mb-2">A hundred?</p>
            <p className="text-3xl md:text-4xl text-amber-400 font-bold">You're drawing new ones.</p>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-400 text-lg mb-2">A thousand?</p>
            <p className="text-2xl md:text-3xl text-orange-300 font-semibold">That's when Congress starts taking our calls.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section 6: What Meroka Is Building
function Section6({ active }) {
  const pillars = [
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      name: 'Rope Teams',
      headline: 'Collective leverage that actually works.',
      description: 'Vendor deals, group purchasing, shared bargaining power. When you\'re tied together, no one negotiates alone.'
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
      name: 'Gear Cache',
      headline: 'Technology unlocked.',
      description: 'AI tools, billing automation, practice analytics. Gear that used to be locked behind hospital walls—now standard issue.'
    },
    {
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
      name: 'Exit Routes',
      headline: 'Your mountain, your timeline.',
      description: 'Paths to ownership, liquidity, and succession the old map never showed. Exit on your terms, not theirs.'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`max-w-5xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12">
          <p className="text-xl text-slate-300 mb-4">
            We're gathering a crew to draw the new paths together.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Here's what the expedition can eventually unlock
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div 
              key={i}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:border-amber-400/50 transition-all group"
            >
              <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-amber-400 mb-2">{pillar.name}</h3>
              <p className="text-xl font-semibold text-white mb-3">{pillar.headline}</p>
              <p className="text-slate-300 text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 7: The Invitation
function Section7({ active, setActiveTab }) {
  return (
    <section className="min-h-screen flex items-center justify-center relative z-10 px-6">
      <div className={`text-center max-w-4xl transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          The map isn't finished.
        </h2>
        <p className="text-xl md:text-2xl text-slate-200 mb-12">
          We're looking for healthcare workers to help draw what's next.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={() => setActiveTab('join')}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all transform hover:scale-105 text-lg shadow-lg shadow-amber-500/30"
          >
            Join the Expedition
          </button>
          <button 
            onClick={() => setActiveTab('expedition')}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 text-lg"
          >
            See the Map
          </button>
        </div>

        <p className="flex items-center justify-center gap-2 text-slate-300 mb-16">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="font-semibold">847</span> explorers on the expedition
        </p>

        <p className="text-slate-400">
          The best paths haven't been drawn yet.
        </p>
      </div>
    </section>
  );
}

// About Page
function AboutPage() {
  const crew = [
    { name: 'Dr. Sarah Chen', role: 'The Cartographer', title: 'CEO & Co-founder', desc: 'Draws the map everyone else follows' },
    { name: 'Marcus Williams', role: 'The Trailblazer', title: 'CTO', desc: 'Builds paths through impossible terrain' },
    { name: 'Dr. Emily Rodriguez', role: 'The Basecamp Builder', title: 'COO', desc: 'If it stands, it\'s because of them' },
    { name: 'James Park', role: 'The Fire Keeper', title: 'Head of Community', desc: 'Where the crew comes to rest and regroup' },
    { name: 'Lisa Thompson', role: 'The Scout', title: 'Head of Product', desc: 'Finds the pain points before they find us' },
    { name: 'Tom Morrison', role: 'The Signal Sender', title: 'Head of Marketing', desc: 'Makes sure no one climbs alone' },
  ];

  const sherpas = [
    { name: 'Dr. Rachel Kim', specialty: 'Family Medicine', years: 18, badge: 'Summit Guide', known: 'First to test the group purchasing trail' },
    { name: 'Dr. Marcus Johnson', specialty: 'Internal Medicine', years: 12, badge: 'Pathfinder', known: 'Mapped the EHR escape route' },
    { name: 'Dr. Priya Patel', specialty: 'Pediatrics', years: 15, badge: 'Fire Starter', known: 'Lit the first campfire in the Midwest region' },
    { name: 'Dr. David Chen', specialty: 'Orthopedics', years: 20, badge: 'Rope Team Captain', known: 'Survived two PE buyout attempts, still independent' },
    { name: 'Dr. Angela Torres', specialty: 'OB-GYN', years: 10, badge: 'Summit Guide', known: 'Runs the most active thread in the forums' },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">Meet the Crew</h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          We run the experiments, hear the pain points, and build the trails that should've existed all along.
        </p>
      </div>

      {/* Internal Team Grid */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {crew.map((member, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all group">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <p className="text-amber-600 text-sm font-semibold mb-1">{member.role}</p>
            <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
            <p className="text-slate-500 text-sm mb-2">{member.title}</p>
            <p className="text-slate-600">{member.desc}</p>
          </div>
        ))}
      </div>

      {/* Sherpas Section */}
      <div className="bg-amber-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">The Sherpas</h2>
          <p className="text-slate-600 mb-8">They've walked these trails longer than anyone. Now they're helping others find the way.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sherpas.map((sherpa, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{sherpa.badge}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{sherpa.name}</h3>
                <p className="text-slate-500 text-sm mb-2">{sherpa.specialty} • {sherpa.years} years</p>
                <p className="text-slate-600 text-sm">{sherpa.known}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Press Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Signal Flares</h2>
          <p className="text-slate-600 mb-8">News from across the mountain.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { date: 'Jan 2025', title: 'Meroka Raises $12M to Build Healthcare\'s New Map', source: 'TechCrunch' },
              { date: 'Dec 2024', title: '500 Independent Physicians Join the Collective', source: 'Healthcare Dive' },
              { date: 'Nov 2024', title: 'Why This Startup Thinks Healthcare Needs Explorers, Not Conquerors', source: 'Forbes' },
            ].map((press, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                <p className="text-slate-400 text-sm mb-2">{press.date} • {press.source}</p>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{press.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Base Camp Page
function BaseCampPage() {
  const roadmap = [
    { status: 'complete', q: 'Q3 2024', title: 'Trail Markers', desc: 'Core platform launch', items: ['Member portal', 'Community forums', 'Resource library'] },
    { status: 'complete', q: 'Q4 2024', title: 'First Campfire', desc: 'Collective leverage tools', items: ['Group purchasing', 'Shared negotiations', 'Vendor partnerships'] },
    { status: 'current', q: 'Q1 2025', title: 'Hidden Paths', desc: 'Technology sharing', items: ['EHR integrations', 'Billing automation', 'AI assistants'] },
    { status: 'upcoming', q: 'Q2 2025', title: 'Summit Routes', desc: 'Financial instruments', items: ['Liquidity options', 'Succession planning', 'Investment access'] },
    { status: 'upcoming', q: 'Q3 2025', title: 'New Territories', desc: 'Expansion & advocacy', items: ['Policy initiatives', 'Regional chapters', 'Training programs'] },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">Base Camp</h1>
        <p className="text-xl text-slate-600 max-w-2xl">
          The infrastructure that makes the expedition possible. Here's what we're building—and when.
        </p>
      </div>

      {/* Roadmap */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Trail Map</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform md:-translate-x-1/2"></div>
          
          {roadmap.map((item, i) => (
            <div key={i} className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Dot */}
              <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 ${
                item.status === 'complete' ? 'bg-green-500' : 
                item.status === 'current' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
              }`}></div>
              
              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  item.status === 'complete' ? 'bg-green-100 text-green-700' :
                  item.status === 'current' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {item.q} {item.status === 'current' && '• In Progress'}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-slate-600 mb-3">{item.desc}</p>
                <ul className={`text-sm text-slate-500 space-y-1 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                  {item.items.map((itm, j) => (
                    <li key={j}>{itm}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Tools */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Gear Ready for the Climb</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, title: 'Member Portal', desc: 'Your expedition headquarters', status: 'Live' },
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>, title: 'Resource Library', desc: '200+ guides and templates', status: 'Live' },
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, title: 'Group Purchasing', desc: '15-40% savings on supplies', status: 'Live' },
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, title: 'Community Forums', desc: 'Connect with fellow explorers', status: 'Live' },
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, title: 'Practice Analytics', desc: 'Benchmark your performance', status: 'Beta' },
              { icon: <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'AI Documentation', desc: 'Cut admin time in half', status: 'Coming Soon' },
            ].map((tool, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">{tool.icon}</div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tool.status === 'Live' ? 'bg-green-100 text-green-700' :
                    tool.status === 'Beta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                  }`}>{tool.status}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{tool.title}</h3>
                <p className="text-slate-600 text-sm">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Expedition Page
function ExpeditionPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const confessionals = [
    { text: "I spent 3 hours on prior auths yesterday. Three hours I could've spent with patients. The old map says this is normal.", time: '2 hours ago', reactions: 47 },
    { text: "Got offered 2x my salary to sell to a PE firm. Turned it down. Some trails aren't worth taking.", time: '5 hours ago', reactions: 128 },
    { text: "My EMR crashed mid-appointment. Again. Hospital IT says it's 'within acceptable parameters.' Acceptable to whom?", time: '1 day ago', reactions: 89 },
  ];

  const wins = [
    { type: 'member', text: 'Dr. Patricia Nguyen joined the expedition', time: '1 hour ago' },
    { type: 'milestone', text: '850 explorers on the mountain', time: '3 hours ago' },
    { type: 'save', text: 'Collective saved $2.3M on supplies this month', time: '1 day ago' },
    { type: 'member', text: 'Riverside Family Practice (4 physicians) joined', time: '2 days ago' },
    { type: 'trail', text: 'New trail mapped: Pediatrics group purchasing', time: '3 days ago' },
  ];

  const experiments = [
    { title: 'Doc\'s Weekly Rant', desc: 'Anonymous physician dispatches', status: 'Active', engagement: '12K reached', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
    { title: 'IP Spotlight Series', desc: 'Independents thriving their way', status: 'Active', engagement: '8 episodes', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { title: 'The Confession Box', desc: 'Anonymous healthcare worker stories', status: 'Testing', engagement: '200+ stories', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg> },
    { title: 'Burnout Calculator', desc: 'What the old map is costing you', status: 'Testing', engagement: '1.2K uses', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">The Expedition</h1>
            <p className="text-xl text-slate-600">See how the exploration is going. Live updates from the trail.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-semibold text-slate-700">847 explorers active</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'confessionals', 'wins', 'scouting missions'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                activeFilter === filter 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'all' ? 'All Updates' : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Confessionals */}
          {(activeFilter === 'all' || activeFilter === 'confessionals') && (
            <div className={activeFilter === 'all' ? '' : 'lg:col-span-3'}>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Confessionals
              </h2>
              <div className="space-y-4">
                {confessionals.map((conf, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                    <p className="text-slate-700 mb-3 italic">"{conf.text}"</p>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Anonymous Explorer • {conf.time}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                        {conf.reactions}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                  Share your story →
                </button>
              </div>
            </div>
          )}

          {/* Wins Feed */}
          {(activeFilter === 'all' || activeFilter === 'wins') && (
            <div className={activeFilter === 'all' ? '' : 'lg:col-span-3'}>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Wins Feed
              </h2>
              <div className="space-y-3">
                {wins.map((win, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-start gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {win.type === 'member' ? (
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      ) : win.type === 'milestone' ? (
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                      ) : win.type === 'save' ? (
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-700 font-medium">{win.text}</p>
                      <p className="text-slate-400 text-sm">{win.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scouting Missions */}
          {(activeFilter === 'all' || activeFilter === 'scouting missions') && (
            <div className={activeFilter === 'all' ? '' : 'lg:col-span-3'}>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                Scouting Missions
              </h2>
              <p className="text-slate-500 text-sm mb-4">New terrain we're exploring. You'll hear about it first.</p>
              <div className="space-y-4">
                {experiments.map((exp, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">{exp.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-slate-800">{exp.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            exp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>{exp.status}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{exp.desc}</p>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-amber-400 h-2 rounded-full" 
                            style={{ width: exp.status === 'Active' ? '80%' : '40%' }}
                          ></div>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{exp.engagement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Join Page
function JoinPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    state: '',
    practice: ''
  });

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Form */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Join the Expedition</h1>
            <p className="text-xl text-slate-600 mb-8">One signup. Hundreds of explorers. A map we draw together.</p>

            {/* Live Counter */}
            <div className="bg-amber-50 rounded-xl p-4 mb-8 flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-bold text-slate-800 text-lg">847</span>
              <span className="text-slate-600">physicians have joined</span>
              <span className="text-green-600 text-sm font-medium ml-auto">+12 this week</span>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">What do we call you on the trail?</label>
                  <input 
                    type="text" 
                    placeholder="Dr. Jane Smith"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Best way to send smoke signals</label>
                  <input 
                    type="email" 
                    placeholder="jane@practice.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">What terrain do you know best?</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-700"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  >
                    <option value="">Select specialty</option>
                    <option value="family">Family Medicine</option>
                    <option value="internal">Internal Medicine</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="obgyn">OB-GYN</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Where are you climbing from?</label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-700"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    <option value="">Select state</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your basecamp <span className="text-slate-400">(optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="Practice name"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                    value={formData.practice}
                    onChange={(e) => setFormData({...formData, practice: e.target.value})}
                  />
                </div>

                <button className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all text-lg mt-4">
                  Start Exploring →
                </button>

                <p className="text-center text-slate-400 text-sm">
                  Free to join. No obligations. Just better trails.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Badge Preview + Testimonials */}
          <div>
            {/* Live Badge Preview */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-8">
              <p className="text-slate-400 text-sm mb-4">Your explorer badge</p>
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {formData.name || 'Dr. _________'}
                </h3>
                <p className="text-slate-400 text-sm mb-3">
                  {formData.specialty ? formData.specialty.charAt(0).toUpperCase() + formData.specialty.slice(1) : 'Specialty'} • {formData.state || 'State'}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-600">
                  <span>Explorer #848</span>
                  <span>Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800">From explorers on the trail</h3>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-700 mb-3">"Saved $47K in my first year through group purchasing. That's a new hire I didn't think I could afford."</p>
                <p className="text-slate-500 text-sm">— Family Medicine, 12 years independent</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-700 mb-3">"I was three months from selling. Then I found 200 people who'd figured out how not to."</p>
                <p className="text-slate-500 text-sm">— Family Medicine, 11 years independent</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <p className="text-slate-700 mb-3">"Asked a question at 10pm. Had three answers by morning. From people who'd been there."</p>
                <p className="text-slate-500 text-sm">— Dermatology, 6 years independent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-2">There's still blank space on the map.</p>
          <p className="text-slate-800 font-semibold">Help us fill it in.</p>
        </div>
      </div>
    </div>
  );
}
