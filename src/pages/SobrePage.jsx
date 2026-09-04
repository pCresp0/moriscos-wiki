import React from 'react';
import { Mail, Github, Linkedin, MessageSquareQuote, HeartHandshake, ExternalLink } from 'lucide-react';

export default function SobrePage({ onNavigate }) {
  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">El proyecto</p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        Sobre esta web
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        Moriscos: Historia, Lugares y Curiosidades es un proyecto personal e independiente para reunir en un solo lugar la historia, la memoria oral y el patrimonio de Moriscos (La Armuña, Salamanca), un pueblo de poco más de 500 habitantes cuya documentación estaba dispersa en archivos, libros agotados y recuerdos de sus vecinos.
      </p>

      <div className="mt-12 space-y-10">
        {/* Agradecimiento de Honor: Miguel Blanco González y moriscos.info */}
        <article className="card-editorial p-6 sm:p-8 border-armuna-light/60 bg-gradient-to-br from-armuna/20 via-noche-surface to-noche-card shadow-2xl">
          <div className="flex items-center gap-3 text-armuna-light">
            <HeartHandshake size={30} className="shrink-0" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-pergamino">
              Agradecimiento especial: Miguel Blanco González y moriscos.info
            </h2>
          </div>
          <p className="mt-4 leading-relaxed text-pergamino-muted/90 text-sm sm:text-base">
            Esta web no habría sido posible sin la extraordinaria labor de recopilación, investigación y conservación desarrollada por <strong className="text-pergamino">Miguel Blanco González</strong>, creador e ingeniero de la web histórica de referencia <a href="https://sites.google.com/view/morisquenos" target="_blank" rel="noopener noreferrer" className="font-semibold text-armuna-light hover:underline inline-flex items-center gap-1">moriscos.info <ExternalLink size={14} /></a>.
          </p>
          <p className="mt-3 leading-relaxed text-pergamino-muted/90 text-sm sm:text-base">
            De su web se ha corroborado gran parte de la información cronológica, genealógica, etnográfica y toponímica reunida en este espacio, habiendo servido como <strong>fuente de inspiración directa y pilar fundamental</strong> para poner en marcha esta iniciativa.
          </p>
          <div className="mt-5 rounded-2xl border border-armuna/35 bg-noche/70 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-pergamino-muted/85">
              ⭐ <strong className="text-armuna-light">Para saber más sobre Moriscos:</strong> Si deseas profundizar e informarte más a fondo sobre el pueblo, sus familias y sus vivencias, te invitamos a visitar <a href="https://sites.google.com/view/morisquenos" target="_blank" rel="noopener noreferrer" className="font-bold text-armuna-light hover:underline">moriscos.info</a>. Lleva <strong>más de 15 años realizada y cuidada</strong> por Miguel Blanco González, y es un verdadero gusto poder informarse y conocer la riqueza de Moriscos gracias a su trabajo.
            </p>
            <div className="mt-4">
              <a
                href="https://sites.google.com/view/morisquenos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-armuna/50 bg-armuna/20 px-4 py-2 text-xs sm:text-sm font-bold text-pergamino hover:bg-armuna/30 hover:border-armuna transition-all cursor-pointer shadow-sm"
              >
                <span>Visitar moriscos.info</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </article>

        <article className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">¿Por qué existe esta web?</h2>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
            Los pueblos pequeños rara vez tienen un espacio digital propio que recoja su historia con el mismo cuidado que una gran ciudad. Esta web nace para que la memoria de Moriscos &mdash;su toponimia, sus gentes, sus sucesos y su paisaje cerealista&mdash; no dependa solo del boca a boca ni de documentos en papel difíciles de consultar, y quede accesible para cualquier vecino, descendiente o curioso.
          </p>
        </article>

        <article className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">¿De dónde procede la información?</h2>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
            Los contenidos se basan en el legado documental del portal <a href="https://sites.google.com/view/morisquenos" target="_blank" rel="noopener noreferrer" className="font-semibold text-armuna-light hover:underline">moriscos.info (Morisqueños)</a> creado por Miguel Blanco González, en monografías históricas locales sobre geografía, toponimia, economía tradicional y sucesos del pueblo, en legajos de archivos históricos diocesanos y estatales, y en fuentes oficiales como el Instituto Geográfico Nacional (IGN) y el Instituto Nacional de Estadística (INE) para datos de altitud, superficie y población. Puedes consultar el listado completo en el apartado de{' '}
            <button
              type="button"
              onClick={() => onNavigate('referencias')}
              className="cursor-pointer font-semibold text-armuna-light hover:underline"
            >
              Referencias
            </button>
            .
          </p>
        </article>

        {/* Contacto y Colaboración */}
        <article className="card-editorial p-6 sm:p-8 border-armuna-light/40 bg-noche-surface">
          <div className="flex items-center gap-3 text-armuna-light">
            <MessageSquareQuote size={28} />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-pergamino">Contacto y colaboración</h2>
          </div>
          <p className="mt-3.5 leading-relaxed text-sm sm:text-base text-pergamino-muted/85">
            Este es un archivo vivo y en constante enriquecimiento. Si tienes documentos antiguos, fotografías familiares, datos genealógicos o deseas aportar cualquier corrección, puedes ponerte en contacto directo:
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="mailto:pcbcrespo@gmail.com"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-armuna/40 bg-armuna/15 px-5 py-3 text-sm sm:text-base font-bold text-pergamino shadow-md transition-all hover:bg-armuna/25"
            >
              <Mail size={18} className="text-armuna-light" />
              <span>pcbcrespo@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/pablocrespobellido/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-noche-border bg-noche px-4 py-3 text-sm font-semibold text-pergamino-muted hover:text-pergamino"
            >
              <Linkedin size={17} />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/pCresp0/moriscos-wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-noche-border bg-noche px-4 py-3 text-sm font-semibold text-pergamino-muted hover:text-pergamino"
            >
              <Github size={17} />
              <span>GitHub</span>
            </a>
          </div>
        </article>

        <article className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            Código abierto: todo está en GitHub
          </h2>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
            El código fuente completo de esta web es público y puede consultarse, descargarse o auditarse libremente en{' '}
            <a
              href="https://github.com/pCresp0/moriscos-wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-armuna-light hover:underline"
            >
              github.com/pCresp0/moriscos-wiki
            </a>
            . En el repositorio se puede ver el historial completo de cambios, cómo está organizado el contenido y cómo
            contribuir o reportar un problema. No hay nada oculto: ni backend propietario, ni base de datos privada, ni
            analítica de terceros.
          </p>
        </article>

        <article className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">Cómo está construida</h2>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
            Es una aplicación de una sola página construida con{' '}
            <strong className="text-pergamino">React, Vite y Tailwind CSS</strong>, sin servidor ni base de datos: todo
            el contenido viaja dentro del propio código, así que cambiar de sección no descarga nada y es instantáneo.
            Es instalable como aplicación y funciona sin conexión gracias a un service worker, y todo el proceso de
            construcción y publicación se ejecuta automáticamente mediante GitHub Actions cada vez que se actualiza el
            contenido.
          </p>
        </article>

        <article className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">Aviso</h2>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
            Este es un proyecto personal e independiente, no oficial ni vinculado al Ayuntamiento de Moriscos ni a
            ninguna institución. Está hecho con cariño hacia el pueblo, con la mejor intención de rigor histórico, pero
            puede contener imprecisiones: toda corrección es bienvenida.
          </p>
          <p className="mt-4 text-sm text-pergamino-muted/80 sm:text-base">
            Web diseñada y desarrollada por{' '}
            <a
              href="https://www.linkedin.com/in/pablocrespobellido/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-armuna-light hover:underline hover:text-pergamino transition-colors"
            >
              Pablo Crespo Bellido
            </a>
            .
          </p>
        </article>
      </div>
    </div>
  );
}
