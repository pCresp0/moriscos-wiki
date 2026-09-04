import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, X, Church, Sparkles } from 'lucide-react';

const ficha = [
  { label: 'Época', value: 'Siglos XII–XVI' },
  { label: 'Estilo', value: 'Mampostería con detalles mudéjares y reforma renacentista' },
  { label: 'Advocación', value: 'San Pedro Apóstol' },
];

const linea = [
  { year: '1164', text: 'Primera mención documental del pueblo y de la parroquia («collationam Sancti Christofori de Morisco»), con 56 vecinos.' },
  { year: '1265', text: 'La iglesia figura en el Libro de todos los préstamos de la Catedral de Salamanca, bajo «MORISCO de Valdevilloria».' },
  { year: 'S. XVI', text: 'Gran reforma y ampliación estructural que le da la fisonomía que conserva hoy.' },
  { year: 'S. XVIII', text: 'Se erige el retablo mayor en estilo rococó.' },
  { year: '1752', text: 'El Catastro del Marqués de la Ensenada detalla sus propiedades, rentas y cargas eclesiásticas.' },
  { year: '1845–1850', text: 'Pascual Madoz describe el casco urbano (unas 40 casas) articulado en torno al templo.' },
  { year: '2016', text: 'Restauración científica del lienzo barroco de la Virgen Peregrina, el 6 de agosto.' },
];

export default function IglesiaPage() {
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
      <p className="kicker flex items-center gap-1.5 text-armuna-light">
        <Church size={16} />
        El monumento
      </p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        La Iglesia de San Pedro Apóstol
      </h1>
      <p className="mt-4 text-balance text-lg text-pergamino-muted/80">
        Es el monumento más importante de Moriscos y el centro neurálgico de su vida comunitaria, religiosa e histórica, con un registro documental que abarca más de 800 años.
      </p>

      {/* Ficha técnica resumida */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {ficha.map((f) => (
          <div key={f.label} className="card-editorial p-5">
            <p className="font-display text-xs tracking-widest text-armuna-light uppercase font-bold">{f.label}</p>
            <p className="mt-1.5 font-serif text-base font-semibold text-pergamino">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Fotografía principal de la Iglesia */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-piedra-border/40 bg-noche-card shadow-2xl">
        <button
          type="button"
          onClick={() =>
            setActiveImage({
              src: '/moriscos-wiki/images/iglesia-san-pedro-aerea.jpg',
              alt: 'Vista aérea de la Iglesia de San Pedro Apóstol de Moriscos, su atrio y el entorno urbano',
              caption:
                'Perspectiva aérea de la Iglesia Parroquial de San Pedro Apóstol de Moriscos: nave única, esbelta torre campanario de sillería, tejados de teja árabe, atrio exterior con cruz de piedra y su emplazamiento en el centro del pueblo.',
            })
          }
          className="group relative block w-full h-[280px] sm:h-[420px] md:h-[500px] overflow-hidden cursor-zoom-in"
          aria-label="Ampliar vista aérea de la Iglesia de San Pedro Apóstol"
        >
          <img
            src="/moriscos-wiki/images/iglesia-san-pedro-aerea.jpg"
            alt="Vista aérea de la Iglesia de San Pedro Apóstol de Moriscos, su atrio y el entorno urbano"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            width="1024"
            height="576"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/25 to-transparent pointer-events-none" />
          <span className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-center justify-between gap-2 text-xs sm:text-sm text-pergamino-muted bg-noche/85 p-3 rounded-xl border border-piedra-400/25 backdrop-blur-md">
            <span className="font-serif font-medium truncate">
              Iglesia parroquial de San Pedro Apóstol: vista aérea de conjunto, atrio y plaza
            </span>
            <span className="inline-flex items-center gap-1.5 text-armuna-light font-semibold shrink-0">
              <ZoomIn size={15} /> Ampliar
            </span>
          </span>
        </button>
      </div>

      <div className="mt-12 space-y-8">
        <div className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            Orígenes y cronología constructiva (siglos XII–XVI)
          </h2>
          <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
            Aunque la estructura actual es fruto de reformas posteriores, la existencia del templo se remonta a los primeros tiempos de la repoblación leonesa. El edificio está construido principalmente en mampostería y sillarejo reforzado con cantería de <strong>Piedra de Villamayor</strong>, pero conserva en sus muros restos de ladrillos y aparejos que corroboran su origen mudéjar o la intervención de maestros de obra mudéjares locales. A finales de la Edad Media y a lo largo del siglo XVI, el templo sufrió una profunda reconstrucción y ampliación estructural que le otorgó la fisonomía que conserva hoy.
          </p>
        </div>

        <div className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            Presencia en archivos y documentos históricos
          </h2>
          <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
            La iglesia cuenta con un registro documental que abarca más de 800 años. La primera mención es el documento de 1164 (4 de octubre), una escritura de compraventa eclesiástica donde Pedro Juan vende Mozodiel al canónigo D. Martín, y que cita la <em>«collationam Sancti Christofori de Morisco»</em>, con una comunidad de 56 vecinos y la parroquia dedicada a San Pedro. En el <em>Libro de todos los préstamos</em> de la Catedral de Salamanca (1265), la iglesia figura registrada con los derechos de cobro de diezmos y préstamos del cabildo catedralicio bajo la denominación de <em>«MORISCO de Valdevilloria»</em>. El Catastro del Marqués de la Ensenada (1752) detalla sus propiedades, rentas, diezmos y cargas eclesiásticas, y el Diccionario de Madoz (1845–1850) describe el casco urbano articulado en torno al templo.
          </p>
        </div>

        {/* Arquitectura con detalle de la torre campanario y cigüeñas */}
        <div className="card-editorial p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/iglesia-torre-ciguenas.jpg',
                alt: 'Torre campanario de la Iglesia de San Pedro Apóstol con nido de cigüeñas y veleta de forja',
                caption:
                  'Primer plano aéreo de la torre campanario de San Pedro Apóstol: cantería dorada de Villamayor, tejado a cuatro aguas de teja árabe, veleta de hierro forjado con cruz y sol radiante, y una pareja de cigüeñas blancas en su nido con los campos de La Armuña al fondo.',
              })
            }
            className="group relative shrink-0 w-48 sm:w-60 h-72 sm:h-80 rounded-2xl bg-noche-surface border border-piedra-400/25 p-2 overflow-hidden shadow-xl cursor-zoom-in transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10"
            aria-label="Ampliar detalle de la torre y nido de cigüeñas"
          >
            <img
              src="/moriscos-wiki/images/iglesia-torre-ciguenas.jpg"
              alt="Detalle de la torre campanario de San Pedro con nido de cigüeñas"
              className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
              width="575"
              height="1024"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={28} />
            </span>
            <span className="absolute bottom-2 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted bg-noche/90 px-2 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ver torre
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-armuna-light">
              Fábrica y elementos
            </span>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              Arquitectura, espadaña-torre y techumbres mudéjares
            </h2>
            <p className="mt-3 text-pergamino-muted/85 leading-relaxed text-sm sm:text-base">
              Templo de <strong>nave única</strong> con muros sólidos y proporciones sobrias típicas de la arquitectura rural de La Armuña. Su elemento más representativo al exterior es la <strong>espadaña-torre de cantería</strong> labrada en arenisca dorada, rematada por un tejado de teja árabe a cuatro aguas y coronada por una veleta de forja tradicional con cruz y sol radiante. En el alero anida permanentemente una colonia de cigüeñas blancas, estampas inconfundibles del paisaje salmantino.
            </p>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed text-sm sm:text-base">
              En su interior destacan las valiosas armaduras y techumbres de madera que cubren la capilla mayor, la antecapilla y la nave central, una singular muestra conservada de la <strong>carpintería de lo blanco mudéjar</strong> tradicional.
            </p>
          </div>
        </div>

        {/* Sección destacada: La Virgen Peregrina */}
        <div className="card-editorial p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <button
            type="button"
            onClick={() =>
              setActiveImage({
                src: '/moriscos-wiki/images/virgen-peregrina.jpg',
                alt: 'Nuestra Señora de la Virgen de la Peregrina, patrona de Moriscos',
                caption:
                  'Nuestra Señora de la Virgen de la Peregrina, patrona de Moriscos: talla procesional en su paso bajo el arco de gloria, vestida con manto carmesí bordado en oro, sombrero jacobeo con conchas y báculo de peregrina.',
              })
            }
            className="group relative shrink-0 w-48 sm:w-60 h-72 sm:h-80 rounded-2xl bg-noche-surface border border-piedra-400/25 p-2.5 overflow-hidden shadow-xl cursor-zoom-in transition-all hover:border-armuna-light/60 hover:shadow-armuna-light/10"
            aria-label="Ampliar imagen de la Virgen Peregrina"
          >
            <img
              src="/moriscos-wiki/images/virgen-peregrina.jpg"
              alt="Talla procesional de la Virgen Peregrina de Moriscos"
              className="h-full w-full object-contain rounded-xl drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
              width="676"
              height="1024"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-pergamino opacity-0 transition-opacity group-hover:opacity-100">
              <ZoomIn size={28} />
            </span>
            <span className="absolute bottom-2 right-2 text-[10px] font-sans tracking-wide text-pergamino-muted bg-noche/90 px-2 py-0.5 rounded border border-piedra-400/20 backdrop-blur-xs">
              Ver talla
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-armuna-light">
              <Sparkles size={14} /> Devoción patronal
            </span>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-armuna-light">
              La patrona: Nuestra Señora de la Virgen Peregrina
            </h2>
            <p className="mt-3 text-pergamino-muted/85 leading-relaxed text-sm sm:text-base">
              Presidiendo el fervor de la comunidad y sus festejos estivales se encuentra la imagen de la <strong>Virgen de la Peregrina</strong>, ataviada tradicionalmente con el hábito y atributos jacobeos: sombrero de ala con conchas de vieira, esclavina de peregrino, báculo procesional y un valioso manto carmesí ricamente bordado en oro.
            </p>
            <p className="mt-3 text-pergamino-muted/80 leading-relaxed text-sm sm:text-base">
              Junto a la talla procesional, el templo custodia el histórico lienzo barroco de la patrona, que fue objeto de una rigurosa restauración científica el 6 de agosto de 2016 por los talleres Uffizzi Conservación y Restauración de Bienes Culturales, gracias al mecenazgo de Antonio García Malmierca y las investigaciones del párroco Hilario Almeida y Miguel Blanco González.
            </p>
          </div>
        </div>

        <div className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            Tesoros artísticos en el interior
          </h2>
          <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
            La cabecera del templo está presidida por un <strong>retablo mayor</strong> decorado en estilo rococó (siglo XVIII). Durante siglos, las paredes y capillas albergaron un valioso conjunto de pinturas murales y tablas renacentistas del siglo XVI que, por razones de seguridad, custodia y conservación museística, fueron trasladadas a la capital provincial y hoy se exhiben en el <strong>Museo de Bellas Artes de Salamanca</strong>.
          </p>
        </div>

        <div className="card-editorial p-6 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
            Cofradías, curiosidades y vida comunitaria
          </h2>
          <p className="mt-3 text-pergamino-muted/80 leading-relaxed">
            La parroquia contó históricamente con la <strong>Cofradía del Santísimo Sacramento</strong> y la <strong>Cofradía de la Virgen Peregrina</strong>, encargadas de la ayuda mutua, los entierros de vecinos y las fiestas patronales. Al igual que ocurre con templos vecinos de la comarca, como la Iglesia de San Esteban en Castellanos de Moriscos, su empaque le valió en la zona el apelativo popular de una de las <em>«Catedrales de La Armuña»</em>. Durante las fiestas de la Virgen Peregrina, la iglesia es el punto de partida del repique manual de campanas, las procesiones por el pueblo y la tradicional subasta de roscas de pan bendito.
          </p>
        </div>
      </div>

      {/* Línea del tiempo */}
      <div className="mt-14">
        <p className="kicker">Cronología</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold text-armuna-light">Hitos históricos de la parroquia</h2>
        <div className="mt-6 space-y-3">
          {linea.map((l) => (
            <div key={l.year} className="card-editorial p-4 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start">
              <span className="font-mono text-sm font-bold text-piedra-300 bg-piedra-900/80 px-3 py-1 rounded-lg shrink-0 border border-noche-border">
                {l.year}
              </span>
              <p className="text-sm sm:text-base text-pergamino-muted/80 leading-relaxed">{l.text}</p>
            </div>
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
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
