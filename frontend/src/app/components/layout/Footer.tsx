import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Services',
      links: [
        { label: 'Grimage', to: '/services' },
        { label: 'Sculpture Ballon', to: '/services' },
        { label: 'Spectacle Magie', to: '/services' },
        { label: 'Visite Personnage', to: '/services' },
        { label: 'Boum Enfants', to: '/services' },
      ],
    },
    {
      title: 'Navigation',
      links: [
        { label: 'Accueil', to: '/' },
        { label: 'Galerie', to: '/gallery' },
        { label: 'Contact', to: '/contact' },
        { label: 'À Propos', to: '/about' },
        { label: 'Réservation', to: '/services' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'CGV', to: '/terms' },
        { label: 'Confidentialité', to: '/privacy' },
        { label: 'Cookies', to: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--fun-orange)] to-[var(--fun-pink)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">FunKids</h2>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Since 2015</p>
              </div>
            </Link>
            <p className="text-gray-400">
              Nous créons des moments magiques et des souvenirs inoubliables pour vos enfants à travers toute la Belgique.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-[var(--fun-purple)] hover:text-white transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-black text-lg mb-6 uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="hover:text-[var(--fun-pink)] transition-colors inline-block hover:translate-x-1 duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-800 grid md:grid-cols-3 gap-8 items-center text-sm text-gray-500">
           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
               <Phone size={14} className="text-[var(--fun-orange)]" />
               <span>+32 000 00 00 00</span>
             </div>
             <div className="flex items-center gap-2">
               <Mail size={14} className="text-[var(--fun-pink)]" />
               <span>hello@funkidz.be</span>
             </div>
             <div className="flex items-center gap-2">
               <MapPin size={14} className="text-[var(--fun-purple)]" />
               <span>Bruxelles, Belgique</span>
             </div>
           </div>

           <div className="text-center">
             <p>© {currentYear} FunKids Animation. Tous droits réservés.</p>
           </div>

           <div className="flex md:justify-end items-center gap-1">
             Fabriqué avec <Heart size={14} className="text-red-500 animate-pulse fill-red-500" /> à Bruxelles
           </div>
        </div>
      </div>
    </footer>
  );
}
