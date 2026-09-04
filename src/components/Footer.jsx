import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { navItems } from './Nav';

const enlaces = ['libro', 'referencias', 'sobre-la-web'];

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="footer-panel w-full shrink-0 mt-auto text-xs text-pergamino-muted/75 sm:text-sm"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)', paddingTop: '2.5rem' }}
    >
      <div className="container-editorial flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <a
            href="mailto:pcbcrespo@gmail.com"
            aria-label="Enviar correo de contacto a pcbcrespo@gmail.com"
            title="Contacto por email: pcbcrespo@gmail.com"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-piedra-300/40 bg-black/30 text-pergamino/85 transition-all hover:border-[#ea4335] hover:text-[#ea4335] hover:scale-105"
          >
            <Mail size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/pablocrespobellido/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Perfil de LinkedIn de Pablo Crespo Bellido"
            title="LinkedIn: Pablo Crespo Bellido"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-piedra-300/40 bg-black/30 text-pergamino/85 transition-all hover:border-[#4db5e8] hover:text-[#4db5e8] hover:scale-105"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/pCresp0/moriscos-wiki"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repositorio en GitHub de Moriscos Wiki"
            title="Repositorio en GitHub: pCresp0/moriscos-wiki"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-piedra-300/40 bg-black/30 text-pergamino/85 transition-all hover:border-piedra-300 hover:text-piedra-300 hover:scale-105"
          >
            <Github size={18} />
          </a>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Enlaces del pie">
          {enlaces.map((id) => {
            const item = navItems.find((n) => n.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className="cursor-pointer font-medium text-pergamino-muted/80 transition-colors hover:text-piedra-300"
              >
                {item?.label ?? id}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-sm text-pergamino/90">
            Web diseñada y desarrollada por{' '}
            <span className="font-semibold text-pergamino">Pablo Crespo Bellido</span>
          </p>
          <p className="text-xs text-pergamino-muted/60">
            &copy; {year} · Moriscos · Historia, Lugares y Curiosidades
          </p>
        </div>
      </div>
    </footer>
  );
}
