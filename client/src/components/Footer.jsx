import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Rights */}
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Memoria. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-5">

          {/* Instagram */}
          <a
            href="https://www.instagram.com/memoria_craftz?stkn=NmFla3dhcmI4b3cx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/18BoVtVHpK/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>

          {/* WhatsApp */}
          {/* <a
            href="https://wa.me/971XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-500 transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a> */}

        </div>
      </div>
    </footer>
  );
};

export default Footer;