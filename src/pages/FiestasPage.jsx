import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, Download } from 'lucide-react';

const otrasFiestas = [
  {
    id: 'fiesta-san-pedro',
    title: 'San Pedro Apóstol',
    date: '29 de junio',
    tag: 'Patrón del pueblo',
    description:
      'Patrón titular de la parroquia y del municipio. Aunque los festejos multitudinarios de verano se centran en la Virgen Peregrina, este día se celebran los actos litúrgicos e institucionales en su honor.',
  },
  {
    id: 'fiesta-san-isidro',
    title: 'San Isidro Labrador',
    date: '15 de mayo',
    tag: 'Fiesta agrícola',
    description:
      'Homenaje de los agricultores a San Isidro con la bendición de los campos de cultivo y una jornada de convivencia, en un municipio históricamente volcado en el secano de La Armuña (trigo, cebada y la I.G.P. Lenteja de La Armuña).',
  },
  {
    id: 'fiesta-lunes-aguas',
    title: 'El Lunes de Agua',
    date: 'Lunes siguiente al Lunes de Pascua',
    tag: 'Tradición salmantina',
    description:
      'Como en toda la provincia, los vecinos acuden al campo en familia o en cuadrillas a merendar el hornazo salmantino, tradicionalmente en la confluencia de los arroyos locales o en los sotos del Tormes, en la finca de La Flecha.',
  },
];

const programa = [
  {
    dia: 'Jueves · Inicio de fiestas',
    badge: 'Chupinazo',
    bullets: [
      'Maquillaje infantil y talleres en el Parque Grande.',
      'A las 21:30 h: Chupinazo inicial y repique manual de campanas desde la torre de la iglesia.',
      'Chocolatada con churros colectiva para vecinos y peñas.',
      'Espectáculos nocturnos de flamenco y rumbas en la Plaza Grande.',
    ],
  },
  {
    dia: 'Viernes',
    badge: 'Feria & Baile',
    bullets: [
      'Casetas de feria y juegos para niños en la Plaza Grande.',
      'Gala de fin de curso de danza de la agrupación local «Más Que Danza Moriscos».',
      'Noche de baile con macrodiscoteca hasta la madrugada.',
    ],
  },
  {
    dia: 'Sábado',
    badge: 'Convivencia',
    bullets: [
      'Animación matutina y vermú con charangas en el Parque Chico.',
      'Paella popular comunitaria, con recaudación benéfica destinada a entidades sociales como la Asociación Autismo ARIADNA.',
      'Encierro infantil de carretones simulados («Asaltacalles») en la Plaza Chica.',
      'Tradicional partido de fútbol sala «Solteros vs. Casados» en el polideportivo comarcal.',
      'Gran verbena nocturna con orquesta y discomóvil.',
    ],
  },
  {
    dia: 'Domingo · Día grande y Misa Solemne',
    badge: 'La Patrona',
    bullets: [
      'Pasacalles matutino de tamborileros y dulzaineros con repique de campanas.',
      'A las 13:00 h: Santa Misa Solemne en honor a la Virgen Peregrina.',
      'Procesión de la Virgen por las calles del casco urbano, llevada a hombros por los vecinos y flanqueada por música procesional.',
      'Tradicional subasta de las roscas de pan bendito.',
      'Tarde infantil con juegos acuáticos, tren neumático y fiesta de la espuma.',
      'A las 21:00 h: Gran parrillada popular de convivencia vecinal, también de carácter benéfico.',
    ],
  },
];

const eventos = [
  {
    title: 'Ruta Nocturna a La Flecha',
    description:
      'Promovida por la Asociación Cultural de Mujeres de Moriscos, esta caminata de 7,7 km se celebra en noches estivales de luna llena, recorriendo el Camino de la Aceña hacia el Tormes y recitando versos de Fray Luis de León y Unamuno.',
  },
  {
    title: 'Tiradas al plato',
    description:
      'Organizadas históricamente durante las fiestas en los terrenos sobrantes de la concentración parcelaria, entre el Camino de la Aceña y Valdepega.',
  },
  {
    title: 'MotoCross de Moriscos',
    description:
      'Evento deportivo de motor celebrado durante años en agosto, aprovechando las crestas y socavones del paraje de Las Cavenes.',
  },
  {
    title: 'Archivo histórico',
    description:
      'La memoria gráfica del pueblo conserva álbumes y vídeos de las fiestas registrados ininterrumpidamente desde 1995.',
  },
];

/*
 * Las Fiestas Patronales empiezan el jueves anterior al primer domingo de
 * agosto (el «domingo grande») y terminan ese mismo domingo. Se calcula en el
 * navegador para que valga automáticamente en cualquier año, sin tocar código.
 */
function firstSundayOfAugust(year) {
  const d = new Date(year, 7, 1);
  const offset = d.getDay() === 0 ? 0 : 7 - d.getDay();
  d.setDate(d.getDate() + offset);
  return d;
}

function festivalRange(year) {
  const sunday = firstSundayOfAugust(year);
  const start = new Date(sunday);
  start.setDate(sunday.getDate() - 3); // jueves
  start.setHours(21, 30, 0, 0); // hora del chupinazo
  const end = new Date(sunday);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function nextFestival(now) {
  let year = now.getFullYear();
  let range = festivalRange(year);
  if (now > range.end) {
    year += 1;
    range = festivalRange(year);
  }
  return { ...range, year };
}

const dateFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' });
const dateFmtWithYear = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

function computeCountdown(now = new Date()) {
  const { start, end, year } = nextFestival(now);
  const range = `${dateFmt.format(start)} – ${dateFmtWithYear.format(end)}`;

  if (now >= start && now <= end) {
    return {
      ongoing: true,
      year,
      label: `¡Las fiestas de ${year} están en marcha!`,
      dates: `Hasta el ${dateFmtWithYear.format(end)}.`,
    };
  }

  const diff = start.getTime() - now.getTime();
  return {
    ongoing: false,
    year,
    label: `Faltan para la Fiesta Mayor de ${year}`,
    dates: `Del ${range}.`,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function FiestasPage() {
  const [countdown, setCountdown] = useState(() => computeCountdown());
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(computeCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeImage) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeImage]);

  const units = [
    { key: 'days', value: countdown.days, label: 'días' },
    { key: 'hours', value: countdown.hours, label: 'horas' },
    { key: 'minutes', value: countdown.minutes, label: 'min' },
    { key: 'seconds', value: countdown.seconds, label: 'seg' },
  ];

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Vida festiva</p>
      <h1 className="mt-2 text-balance font-serif text-3xl font-bold text-pergamino sm:text-5xl">
        Fiestas y tradiciones de Moriscos
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        Las fiestas y celebraciones de Moriscos conjugan la devoción religiosa, las tradiciones agrícolas de la comarca
        de La Armuña y una intensa vida comunitaria intergeneracional.
      </p>

      {/* Cuenta atrás */}
      <div className="mt-8 rounded-2xl border border-noche-border bg-noche-card/90 p-6 backdrop-blur-md sm:p-8">
        <p className="kicker">Cuenta atrás</p>
        <p className="mt-2 font-serif text-lg font-bold text-pergamino">{countdown.label}</p>

        {countdown.ongoing ? (
          <p className="mt-6 text-center font-display text-4xl font-bold text-armuna-light">🎉</p>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-3 text-center">
            {units.map((unit) => (
              <div key={unit.key} className="rounded-xl border border-noche-border/60 bg-noche/70 p-3">
                <span className="block font-display text-2xl font-bold text-armuna-light sm:text-4xl">
                  {unit.value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-pergamino-muted/60">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-xs italic text-pergamino-muted/65 sm:text-sm">{countdown.dates}</p>
      </div>

      {/* Fiesta mayor */}
      <div className="mt-14">
        <p className="kicker">Fiesta mayor</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-armuna-light sm:text-3xl">
          Fiestas Patronales en honor a la Virgen de la Peregrina
        </h2>

        {/* Tarjeta destacada con la imagen de la Virgen Peregrina */}
        <div id="fiesta-peregrina" className="mt-6 card-editorial p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start scroll-mt-24">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/virgen-peregrina.jpg',
                alt: 'Nuestra Señora de la Virgen de la Peregrina en su paso procesional',
                caption:
                  'Nuestra Señora de la Virgen de la Peregrina en su paso procesional durante las Fiestas Patronales de Moriscos: ataviada con el manto carmesí bordado en oro, sombrero con conchas de Santiago y báculo de peregrina. Fotografía: Pablo Crespo Bellido.',
                originalSrc: '/moriscos-wiki/images/originals/virgen-peregrina-original.jpg',
                originalSize: '244 KB',
              })
            }
            className="group relative shrink-0 w-44 sm:w-56 h-64 sm:h-72 rounded-2xl bg-noche-surface border border-piedra-400/25 p-2.5 overflow-hidden shadow-xl cursor-zoom-in transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10"
            aria-label="Ampliar imagen de la Virgen Peregrina"
          >
            <img
              src="/moriscos-wiki/images/virgen-peregrina.jpg"
              alt="Paso procesional de la Virgen Peregrina en las fiestas de Moriscos. Fotografía: Pablo Crespo Bellido"
              className="h-full w-full object-contain rounded-xl drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
              width="676"
              height="1024"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={28} />
            </span>
            <span className="absolute bottom-2 right-2 text-[10px] font-sans tracking-wide text-armuna-light bg-noche/90 px-2 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs font-mono">
              Foto: Pablo Crespo
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-pergamino">
              La devoción y el encuentro morisqueño
            </h3>
            <p className="mt-3 leading-relaxed text-pergamino-muted/85 text-sm sm:text-base">
              Es la fiesta principal del municipio. La patrona de Moriscos es la{' '}
              <strong className="text-pergamino">Virgen de la Peregrina</strong>, cuya talla procesional recorre en
              andas las calles del pueblo cada primer domingo de agosto, acompañada por el himno nacional, cohetes,
              volteo de campanas y pasacalles tradicionales de dulzaina y tamboril.
            </p>
            <p className="mt-3 leading-relaxed text-pergamino-muted/80 text-sm sm:text-base">
              La iglesia custodia asimismo su histórico lienzo barroco, restaurado en 2016, que preside los cultos de la
              parroquia durante la semana mayor.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="card-editorial p-6 sm:p-8">
            <h3 className="font-serif text-lg font-bold text-armuna-light sm:text-xl">Cambio histórico de fechas</h3>
            <p className="mt-3 leading-relaxed text-pergamino-muted/80">
              Antiguamente, la festividad se celebraba el <strong className="text-pergamino">Domingo de Pentecostés</strong>.
              Hacia 1988, como ocurrió en muchos pueblos castellanos, la celebración se trasladó a los meses de verano
              para facilitar la asistencia de los vecinos que residen fuera durante sus vacaciones y de los estudiantes
              tras los exámenes. Actualmente se celebra entre la{' '}
              <strong className="text-pergamino">última semana de julio y el primer fin de semana de agosto</strong>.
            </p>
          </div>

          <div className="card-editorial p-6 sm:p-8">
            <h3 className="font-serif text-lg font-bold text-armuna-light sm:text-xl">Semana cultural previa</h3>
            <p className="mt-3 leading-relaxed text-pergamino-muted/80">
              Durante los diez días anteriores al estallido de las fiestas (a partir del 21 de julio
              aproximadamente), el Ayuntamiento y las asociaciones locales organizan una semana cultural con cine de
              verano al aire libre, certámenes de teatro de calle, exposiciones y recitales de música tradicional
              castellana.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="kicker">Programa de festejos</p>
          <div className="mt-4 grid gap-4 sm:gap-5">
            {programa.map((acto) => (
              <div key={acto.dia} className="card-editorial p-5 sm:p-6 transition-all hover:border-piedra-400/40">
                <div className="flex items-center justify-between gap-3 mb-3.5 border-b border-noche-border/60 pb-3">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-pergamino">
                    {acto.dia}
                  </h3>
                  {acto.badge && (
                    <span className="rounded-full bg-armuna/15 border border-armuna/30 px-2.5 py-0.5 text-[11px] font-semibold text-armuna-light shrink-0">
                      {acto.badge}
                    </span>
                  )}
                </div>
                <ul className="space-y-2.5 text-sm leading-relaxed text-pergamino-muted/85">
                  {acto.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-armuna-light ring-4 ring-armuna/20" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="card-editorial mt-10 p-6 sm:p-8">
          <h3 className="font-serif text-lg font-bold text-armuna-light sm:text-xl">Ritos y costumbres exclusivas</h3>
          <p className="mt-3 leading-relaxed text-pergamino-muted/80">
            La memoria local recogida por el portal Morisqueños destaca la pervivencia de costumbres propias como la{' '}
            <strong className="text-pergamino">«Acogótala»</strong> &mdash;un ritual festivo de convivencia entre las
            peñas del pueblo&mdash; y <strong className="text-pergamino">«la pedida de la botella»</strong>, en la que
            mozos y peñas recorren las casas o bodegas del municipio pidiendo refrescos o vino para la fiesta.
          </p>
        </div>
      </div>

      {/* Otras fiestas del año */}
      <div className="mt-16">
        <p className="kicker">Calendario festivo</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-armuna-light">Otras fiestas del año</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {otrasFiestas.map((f) => (
            <article key={f.title} id={f.id} className="card-editorial flex flex-col justify-between scroll-mt-24">
              <div>
                <span className="mb-2 inline-block rounded-md bg-armuna/20 px-2.5 py-1 text-xs font-semibold text-armuna-light">
                  {f.tag}
                </span>
                <h3 className="font-serif text-lg font-bold text-pergamino">{f.title}</h3>
                <p className="mt-1 font-mono text-xs text-piedra-300">{f.date}</p>
                <p className="mt-2.5 text-xs leading-relaxed text-pergamino-muted/75 sm:text-sm">{f.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Eventos culturales y deportivos */}
      <div className="mt-16">
        <p className="kicker">Más allá de las fiestas</p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-armuna-light">Eventos culturales y deportivos</h2>
        <div className="mt-6 space-y-5">
          {eventos.map((e) => (
            <article key={e.title} className="border-l-2 border-armuna-light/60 pl-5">
              <h3 className="font-serif text-base font-semibold text-pergamino">{e.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-pergamino-muted/75">{e.description}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Lightbox para ampliar las fotos */}
      {activeImage &&
        createPortal(
          <div
            className="dialog-content fixed inset-0 z-[400] flex flex-col items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-md"
            data-state="open"
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt || 'Imagen ampliada'}
            onClick={() => setActiveImage(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
              aria-label="Cerrar imagen ampliada"
              className="fixed z-[410] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-noche shadow-xl cursor-pointer active:scale-95 transition-transform hover:scale-105"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
              }}
            >
              <X size={28} strokeWidth={2.5} />
            </button>
            <div
              className="flex flex-col items-center max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="max-h-[75vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
              />
              {activeImage.caption && (
                <p className="mt-3 text-center text-sm sm:text-base font-serif text-pergamino-muted max-w-2xl bg-noche/85 px-4 py-2.5 rounded-xl border border-piedra-400/25 shadow-lg backdrop-blur-sm">
                  {activeImage.caption}
                </p>
              )}
              {activeImage.originalSrc && (
                <div className="mt-3">
                  <a
                    href={activeImage.originalSrc}
                    download="virgen-peregrina-moriscos-master.jpg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-armuna px-4 py-2 text-xs sm:text-sm font-bold text-noche hover:bg-armuna-light transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                  >
                    <Download size={15} strokeWidth={2.5} />
                    <span>Descargar original en máxima resolución ({activeImage.originalSize})</span>
                  </a>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
