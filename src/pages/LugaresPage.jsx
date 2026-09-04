import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X } from 'lucide-react';

const emblematicos = [
  {
    title: 'Parque Grande',
    description:
      'Centro neurálgico de las Fiestas Patronales en honor a la Virgen de la Peregrina: aquí se celebra el chupinazo inicial, el repique manual de campanas, la chocolatada popular, los talleres infantiles y la parrillada popular de cierre.',
  },
  {
    title: 'Parque Chico y Plaza Chica',
    description:
      'Espacios de ocio familiar y animación festiva, escenario de los vermús con charanga y del "Asaltacalles", la carrera infantil de carretones simulados.',
  },
  {
    title: 'Plaza Grande, Centro Social y Bar de Chinarrilla',
    description:
      'En el corazón del casco urbano. La biblioteca actual se construyó originalmente como centro social y taberna comunitaria, donde funcionó el histórico Bar de Chinarrilla (regentado por Narci), lugar donde se cataba el vino artesanal de Valdepega, bautizado irónicamente "D.O. Valdepega". En la plaza se instalan hoy los escenarios de las orquestas y las casetas festivas.',
  },
  {
    title: 'Iglesia Parroquial de San Pedro Apóstol',
    description:
      'El edificio más monumental del pueblo, una de las "Catedrales de La Armuña". Con orígenes entre los siglos XII y XVI, alberga el retablo mayor rococó, armaduras de madera y el lienzo barroco restaurado de la Virgen Peregrina.',
    tab: 'iglesia',
  },
];

const parajes = [
  {
    title: 'Vértice Geodésico "Andorra" (871,4 m)',
    description:
      'En la cota más alta del municipio (el topónimo árabe al-Andurra alude a matorrales o terreno escarpado). Un balcón natural sobre la penillanura de La Armuña y la vega del Tormes, 93 m sobre el río y 63 m sobre la Plaza Mayor de Salamanca.',
    tab: 'ruta-nocturna',
  },
  {
    title: 'Laguna de la Serrada',
    description:
      'Depresión endorreica en el alto de una colina en cresta, que le da nombre. Punto de agua clave para el ganado; sus márgenes fueron reforestados por la Asociación de Cazadores local como refugio y criadero de la perdiz roja.',
    tab: 'ruta-nocturna',
  },
  {
    title: 'Pago de Valdepega',
    description:
      'Vallejo abrigado ("valle de las pegas", urracas) que albergó la tradición vitivinícola de autoconsumo de Moriscos. Conserva la última viña superviviente del término municipal.',
  },
  {
    title: 'Carrelavieja y La Pardaleja',
    description:
      'Microtopónimos agrícolas: Carrelavieja alude a la antigua "carrera" o camino en desuso; La Pardaleja remite al color pardo de sus tierras o a la abundancia histórica de pardales (gorriones).',
  },
  {
    title: 'Las Cavenes (o Cahenes)',
    description:
      'Socavones y cárcavas en la cornisa fluvial hacia el Tormes, restos de antiguas explotaciones mineras romanas de oro a cielo abierto mediante lavado de arenas aluviales (ruina montium).',
    tab: 'ruta-nocturna',
  },
  {
    title: 'El Teso de La Cabaña y El Parapeto',
    description:
      'Cerros estratégicos donde las tropas francesas del mariscal Marmont instalaron trincheras en junio de 1812, antes de ser desalojadas por las tropas de Wellington previas a la Batalla de Los Arapiles.',
    tab: 'ruta-nocturna',
  },
];

const desaparecidos = [
  {
    title: 'La Charca Municipal y Abrevadero',
    what:
      'Frente a la Calle de las Ánimas y la casa de Natalia y Damián (última yunta de bueyes del pueblo hasta los años 70), una gran balsa comunal recogía la escorrentía pluvial para dar de beber a bueyes, mulas y caballos, ya que el agua de los pozos locales era muy dura.',
    why: 'La mecanización agrícola de los 60-70 y la llegada del agua corriente la dejaron sin función; fue desecada y hoy son parques y zonas verdes del casco urbano.',
  },
  {
    title: 'Las Eras de Trilla',
    what:
      'Extensas explanadas de tierra apisonada a las afueras donde se trillaba, se aventaba el grano al viento y se medía con la media fanega de madera para llenar los costales.',
    why: 'Las cosechadoras mecánicas eliminaron el trabajo manual; desde los 90-2000 estos terrenos periurbanos se recalificaron para el crecimiento residencial.',
  },
  {
    title: 'El trazado original del Camino de la Aceña',
    what: 'Camino histórico que nacía en el antiguo frontón municipal y conectaba Moriscos con la Aceña hidráulica de La Flecha, para moler trigo y traer agua blanda.',
    why: 'La concentración parcelaria de mediados del siglo XX rediseñó las fincas para el paso de tractores, interrumpiendo el paso directo con Cabrerizos y desviando el tránsito por el Camino de Valdepega.',
  },
  {
    title: 'El Pontón de Piedras sobre el Regato',
    what: 'Pasarela de grandes losas de cantería para cruzar el arroyo en la antigua Calzada de Medina sin quedar atrapado en los lodazales.',
    why: 'Quedó soterrado tras la canalización del arroyo y las obras de pavimentación de los accesos urbanos.',
  },
  {
    title: 'El núcleo de la Estación de Ferrocarril',
    what: 'Poblado secundario surgido a partir de 1877 con la línea Medina-Salamanca (km 69,380), con almacenes de grano, casetas de guardagujas y viviendas ferroviarias.',
    why: 'La automatización de las vías y el paso del transporte de grano del tren al camión eliminaron los puestos presenciales; hoy es solo un apeadero automatizado de Media Distancia.',
  },
  {
    title: 'Los despoblados medievales de El Hoyo y La Cruz',
    what: 'Antiguas alquerías y aldeas medievales independientes dentro del alfoz salmantino.',
    why: 'Desaparecieron entre los siglos XVI y XVIII por concentración de la propiedad, crisis demográficas y presión fiscal; sus términos fueron absorbidos por Moriscos (El Hoyo quedó inmortalizado en el escudo municipal).',
  },
  {
    title: 'La Granja Agustina de La Flecha Baja y la Aceña',
    what: 'Finca agustina fundada en 1451, con aceña hidráulica, oratorio renacentista, palomar, huertas y soto fluvial. Refugio de Fray Luis de León y Miguel de Unamuno.',
    why: 'Tras la Desamortización de Mendizábal (1835) pasó a manos privadas; en los 70 una piscifactoría alteró el cauce y destruyó la isla del soto, y un chalet quedó inconcluso sobre la propia aceña. Tras expolios de piedra, entró en 2011 en la Lista Roja del Patrimonio de Hispania Nostra.',
    tab: 'ruta-nocturna',
  },
  {
    title: 'El campo de tiro al plato y el circuito de MotoCross',
    what: 'Tiro al plato en el triángulo sobrante de la concentración parcelaria entre el Camino de la Aceña y Valdepega; circuito de MotoCross diseñado por jóvenes en los 80 sobre los socavones romanos de Las Cavenes.',
    why: 'Desaparecieron al endurecerse las normativas de seguridad y al primarse la protección ambiental de los escarpes del Tormes.',
  },
];

export default function LugaresPage({ onNavigate }) {
  const [activeImage, setActiveImage] = useState(null);

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

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker">Geografía y memoria</p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        Lugares de Moriscos
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        El término municipal y el casco urbano albergan un patrimonio geográfico, histórico y urbano repleto de rincones con historia. Algunos son puntos clave de la vida comunitaria actual; otros han sido transformados por el paso del tiempo, la mecanización agrícola o la expansión urbanística.
      </p>

      {/* Panorámica general aérea de Moriscos */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
        <button
          type="button"
          onClick={() =>
            setActiveImage({
              src: '/moriscos-wiki/images/moriscos-panoramica-atardecer.jpg',
              alt: 'Panorámica aérea de Moriscos al atardecer sobre los campos de La Armuña',
              caption:
                'Panorámica aérea de Moriscos al atardecer (18 de julio de 2026): vista completa de la morfología del pueblo, con la silueta de la torre de San Pedro en el centro, rodeada por el mosaico de campos de cultivo de La Armuña.',
            })
          }
          className="group relative block w-full h-[250px] sm:h-[380px] md:h-[440px] overflow-hidden cursor-zoom-in"
          aria-label="Ampliar vista aérea de Moriscos"
        >
          <img
            src="/moriscos-wiki/images/moriscos-panoramica-atardecer.jpg"
            alt="Morfología urbana y entorno natural de Moriscos al atardecer"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            width="1024"
            height="576"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/25 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between gap-2 text-xs sm:text-sm text-pergamino-muted bg-noche/85 p-3 rounded-xl border border-piedra-400/25 backdrop-blur-md">
            <span className="font-serif font-medium truncate">
              Morfología urbana y campos de labor de La Armuña al atardecer · 18 de julio de 2026
            </span>
            <span className="inline-flex items-center gap-1.5 text-armuna-light font-semibold shrink-0">
              <ZoomIn size={15} /> Ampliar
            </span>
          </div>
        </button>
      </div>

      {/* 1. Lugares Emblemáticos */}
      <div className="mt-12">
        <p className="kicker">Vida comunitaria</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-armuna-light">Localizaciones emblemáticas actuales</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {emblematicos.map((l) => (
            <div key={l.title} className="card-editorial flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-pergamino">{l.title}</h3>
                <p className="mt-2 text-sm text-pergamino-muted/75 leading-relaxed">{l.description}</p>
              </div>
              {l.tab && (
                <button
                  type="button"
                  onClick={() => onNavigate(l.tab)}
                  className="mt-4 text-xs font-semibold text-armuna-light hover:underline text-left cursor-pointer"
                >
                  Ver más en {l.tab.replace('-', ' ')} →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Parajes Naturales */}
      <div className="mt-14">
        <p className="kicker">Entorno y paisaje</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-armuna-light">Parajes y cotas del término</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {parajes.map((p) => (
            <div key={p.title} className="card-editorial flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-pergamino">{p.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-pergamino-muted/75 leading-relaxed">{p.description}</p>
              </div>
              {p.tab && (
                <button
                  type="button"
                  onClick={() => onNavigate(p.tab)}
                  className="mt-4 text-xs font-semibold text-armuna-light hover:underline text-left cursor-pointer"
                >
                  Ver en el mapa →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Campiña y labores de la cosecha en La Armuña */}
      <div className="mt-14 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
        <div className="grid md:grid-cols-12 gap-0 items-stretch">
          <div className="md:col-span-5 relative bg-noche">
            <button
              type="button"
              onClick={() =>
                setActiveImage({
                  src: '/moriscos-wiki/images/moriscos-cosecha-alpacas.jpg',
                  alt: 'Tractor transportando alpacas de paja al atardecer en los caminos rurales de Moriscos',
                  caption:
                    'Cosecha y empacado de cereal en La Armuña (15 de julio de 2025): un tractor con remolque de alpacas avanza junto a parcelas de girasoles y rastrojos, con la silueta de Moriscos al fondo bajo el ocaso estival.',
                })
              }
              className="group relative block w-full h-[320px] md:h-full overflow-hidden cursor-zoom-in"
              aria-label="Ampliar fotografía de la cosecha y empacado de cereal"
            >
              <img
                src="/moriscos-wiki/images/moriscos-cosecha-alpacas.jpg"
                alt="Tractor con remolque de alpacas de paja de cereal al atardecer en Moriscos"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                width="576"
                height="1024"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/15 to-transparent pointer-events-none md:bg-gradient-to-r md:from-transparent md:to-noche/40" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-pergamino-muted bg-noche/85 p-2.5 rounded-xl border border-piedra-400/25 backdrop-blur-md">
                <span className="font-serif font-medium truncate">15 de julio de 2025 · Cosecha estival</span>
                <span className="inline-flex items-center gap-1 text-armuna-light font-semibold shrink-0">
                  <ZoomIn size={14} /> Ampliar
                </span>
              </div>
            </button>
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="kicker">Identidad agrícola</p>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-pergamino">
                La campiña de La Armuña: tiempo de mies y cosecha
              </h2>
              <p className="mt-4 text-sm sm:text-base text-pergamino-muted/80 leading-relaxed">
                Durante las semanas de julio, los pagos de Moriscos se transforman al compás del ciclo cerealista. Tras la siega del trigo y la cebada, las empacadoras recogen la paja dorada en grandes fardos rectangulares («alpacas») que los tractores trasladan a las naves ganaderas antes de que caiga la noche.
              </p>
              <p className="mt-3 text-sm sm:text-base text-pergamino-muted/80 leading-relaxed">
                En esta estampa del 15 de julio de 2025, el camino de concentración parcelaria dibuja una frontera natural entre el amarillo intenso de los girasoles en plena floración y el rastrojo segado, con el caserío del pueblo recortándose en el horizonte bajo la luz dorada del poniente salmantino.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-piedra-border/40 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-pergamino-muted/70 font-mono">
                Coordenadas 41°00′28″N 5°34′59″O
              </span>
              <button
                type="button"
                onClick={() => onNavigate('galeria')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-armuna-light hover:text-pergamino transition-colors cursor-pointer"
              >
                Ver esta y más fotos en la Galería →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lugares Desaparecidos */}
      <div className="mt-14">
        <p className="kicker">Memoria colectiva</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-armuna-light">Lugares desaparecidos o transformados</h2>
        <div className="mt-6 space-y-4">
          {desaparecidos.map((d) => (
            <div key={d.title} className="card-editorial p-5 sm:p-6">
              <h3 className="font-serif text-lg font-bold text-pergamino">{d.title}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                <div className="bg-noche/60 rounded-xl p-3 border border-noche-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-armuna-light">Qué era</span>
                  <p className="mt-1 text-pergamino-muted/80">{d.what}</p>
                </div>
                <div className="bg-noche/60 rounded-xl p-3 border border-noche-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-soto-light">Por qué desapareció</span>
                  <p className="mt-1 text-pergamino-muted/80">{d.why}</p>
                </div>
              </div>
              {d.tab && (
                <button
                  type="button"
                  onClick={() => onNavigate(d.tab)}
                  className="mt-3 text-xs font-semibold text-armuna-light hover:underline text-left cursor-pointer"
                >
                  Ver detalle en {d.tab.replace('-', ' ')} →
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox para la foto panorámica */}
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
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
