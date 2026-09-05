import React, { useState, useEffect, useRef } from 'react';
import {
  Wheat,
  Sprout,
  Waves,
  Train,
  Building2,
  BookOpen,
  ArrowRight,
  Info,
  Layers,
  FlaskConical,
  Factory,
  Compass,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { useT } from '../i18n';


const BASE_URL = import.meta.env.BASE_URL || '/';
const getImg = (path) => `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

const sections = [
  {
    id: 'secano-bueyes',
    title: '1. Secano, bueyes y rotación «a dos hojas»',
    shortTitle: 'Secano y bueyes',
    icon: Wheat,
    color: 'from-amber-500/20 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/30',
    badge: 'Siglos XII – XIX',
  },
  {
    id: 'lenteja-gorgojo',
    title: '2. El milagro de la Lenteja y el gorgojo',
    shortTitle: 'Lenteja y gorgojo',
    icon: Sprout,
    color: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/30',
    badge: 'Agronomía & Siglo XX',
  },
  {
    id: 'aceñas-tormes',
    title: '3. Economías fluviales: Aceñas y maquila',
    shortTitle: 'Aceñas del Tormes',
    icon: Waves,
    color: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    borderColor: 'border-cyan-500/30',
    badge: 'Molienda fluvial',
  },
  {
    id: 'madoz-tren-silos',
    title: '4. Madoz (1845), el ferrocarril y los silos',
    shortTitle: 'Ferrocarril y silos',
    icon: Train,
    color: 'from-orange-500/20 via-orange-500/5 to-transparent',
    borderColor: 'border-orange-500/30',
    badge: '1877 – 1990',
  },
  {
    id: 'siglo-xxi-novartis',
    title: '5. Siglo XXI: Novartis, industria y presente',
    shortTitle: 'Siglo XXI & Novartis',
    icon: Factory,
    color: 'from-blue-500/20 via-blue-500/5 to-transparent',
    borderColor: 'border-blue-500/30',
    badge: 'Vanguardia actual',
  },
  {
    id: 'fuentes-referencias',
    title: '6. Fuentes y referencias documentales',
    shortTitle: 'Referencias',
    icon: BookOpen,
    color: 'from-purple-500/20 via-purple-500/5 to-transparent',
    borderColor: 'border-purple-500/30',
    badge: 'Aparato crítico',
  },
];

const sourcesData = [
  {
    id: 'fuente-historia-economica',
    title: '«Historia económica de Moriscos y la comarca de La Armuña»',
    badge: 'Monografía comarcal',
    summary:
      'Estudio agronómico y socioeconómico de la penillanura armuñesa. Aporta las características del suelo arcilloso (800–900 m de altitud, materia orgánica media del 0,97%), el sistema de rotación «a dos hojas», la primacía del trigo candeal, mocho y rubión, la simbiosis biológica de la bacteria Rhizobium con la Lenteja Rubia de La Armuña («gigante de Gomecello»), la llegada del ferrocarril en 1877, los silos de hormigón de la Red Nacional (1949–1990), la planta biotecnológica de radioligandos de Novartis (12,9 M€ en Castellanos de Moriscos), la presencia de Helcesa (1984), el CTR de Gomecello (2007) y las firmas agroalimentarias de calidad (Legumbres Montes y Legumer).',
    temas: ['Suelo y agronomía', 'Rotación a dos hojas', 'Lenteja de La Armuña', 'Ferrocarril y polígonos industriales'],
  },
  {
    id: 'fuente-analisis-multidimensional',
    title: '«Análisis histórico multidimensional de Moriscos (Salamanca)»',
    badge: 'Análisis histórico',
    summary:
      'Explica la fuerza de tracción empleada en la labranza y documenta la frontera geográfica y cultural en el uso del ganado de tiro: en La Armuña y la Tierra de Charra se utilizaban tradicionalmente bueyes de labor, a diferencia de las comarcas vecinas de Peñaranda y Cantalapiedra, donde predominaba el uso de las mulas.',
    temas: ['Tracción animal', 'Bueyes de labor frente a mulas', 'Fronteras agropecuarias'],
  },
  {
    id: 'fuente-lexico-mozodiel',
    title: '«LÉXICO DE LA ZONA | Mozodiel de Sanchíñigo»',
    badge: 'Etnografía y léxico',
    summary:
      'Recoge los términos tradicionales de labor armuñesa como «alzar» (primera labor profunda a los barbechos con bueyes), «aricar» (escarda ligera para arrimar tierra) y la «boyá» (rebaño comunal guiado por el boyero concejil). Asimismo documenta la plaga histórica del gorgojo, la conservación arcaica en tinajas de aceite de oliva de la Sierra de Gata, la máquina de tostar de D. Gonzalo Sánchez (herrero de Calzada) y la posterior revolución de los «asfixies» con bobolina para exterminar la plaga por anoxia.',
    temas: ['Vocabulario tradicional', 'Plaga del gorgojo', 'Boyero concejil', 'Conservación del grano'],
  },
  {
    id: 'fuente-historia-cabrerizos',
    title: '«Historia - Ayuntamiento de Cabrerizos»',
    badge: 'Archivo municipal',
    summary:
      'Describe la economía hidráulica de molienda en las márgenes del río Tormes. La construcción de costosas aceñas de cantería constituyó un lucrativo monopolio feudal en manos del Cabildo catedralicio (como el Chantre Pedro en 1240) y de la oligarquía salmantina, desencadenando disputas entre regidores como Juan Vázquez Coronado y Gonzalo de Villafuerte por el control de la harina armuñesa.',
    temas: ['Molinos y aceñas del Tormes', 'Monopolio señorial y capitular', 'Comercio harinero'],
  },
  {
    id: 'fuente-guion-la-flecha',
    title: '«RUTA A LA FLECHA-GUION.docx»',
    badge: 'Guion etnográfico local',
    summary:
      'Detalla el régimen de la maquila (1/12 parte de la fanega, es decir, 1 celemín por fanega) y cómo los molineros acababan convertidos en los panaderos de Moriscos y Castellanos. Registra que los labradores bajaban los bueyes a invernar al soto de La Flecha, subían agua blanda del río para cocinar ante la dureza extrema de los pozos de Moriscos (>40º de dureza) y recoge oficios artesanales como Miguel el Silletero recolectando esparto para confeccionar asientos.',
    temas: ['Régimen de la maquila', 'Invernada en La Flecha', 'Pozos y aguadores', 'Oficios artesanales'],
  },
  {
    id: 'fuente-madoz-silos',
    title: '«Diccionario de Madoz (1845–1850)» & «Silos de Gomecello (Salamanca en el ayer / FEGA)»',
    badge: 'Geografía histórica & FEGA',
    summary:
      'Radiografía decimonónica de Moriscos (40 casas, pozos hondos, gran charca comunal) y Castellanos (72 casas mezquinas para 312 vecinos). Constata los dos grandes silos de cereal de Gomecello construidos por el Servicio Nacional del Trigo y su desamortización mediante subasta pública por el FEGA en 2021.',
    temas: ['Censo decimonónico', 'Red Nacional de Silos', 'Servicio Nacional del Trigo'],
  },
];

export default function EconomiaPage({ onNavigate, target }) {
  const t = useT();
  const [activeSection, setActiveSection] = useState('secano-bueyes');
  const sectionRefs = useRef({});

  useEffect(() => {
    if (target && sectionRefs.current[target]) {
      sectionRefs.current[target].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(target);
    }
  }, [target]);

  const scrollTo = (id) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container-editorial py-10 sm:py-16">
      {/* Header editorial */}
      <div className="text-left">
        <p className="kicker flex items-center gap-2">
          <Wheat size={16} className="text-armuna-light" />
          <span>{t('economy.kicker')}</span>
        </p>
        <h1 className="mt-2 text-balance font-serif text-3xl font-bold tracking-tight text-pergamino sm:text-5xl">
          {t('economy.title')}
        </h1>

        <p className="mt-4 text-balance text-base leading-relaxed text-pergamino-muted/85 sm:text-lg">
          La economía y el sustento de los habitantes de <strong className="text-pergamino">Moriscos</strong> y de los municipios de la comarca de <strong className="text-pergamino">La Armuña</strong> (Salamanca) han experimentado una profunda metamorfosis a lo largo de los siglos: desde la autarquía cerealista medieval y el arado de bueyes hasta la revolución de la <span className="text-armuna-light font-semibold">Lenteja de La Armuña</span>, la molienda hidráulica en el Tormes, el ferrocarril de 1877 y la vanguardia biotecnológica del siglo XXI.
        </p>

        {/* Chips de datos clave */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-armuna/30 bg-noche-card/80 px-3.5 py-1.5 text-xs text-pergamino font-medium">
            <Compass size={13} className="text-armuna-light" />
            Altitud: 800–900 m (Penillanura)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-armuna/30 bg-noche-card/80 px-3.5 py-1.5 text-xs text-pergamino font-medium">
            <Layers size={13} className="text-armuna-light" />
            Suelo: 0,97% materia orgánica
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-armuna/30 bg-noche-card/80 px-3.5 py-1.5 text-xs text-pergamino font-medium">
            <Wheat size={13} className="text-armuna-light" />
            Labor: Rotación «a dos hojas» + Bueyes
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-armuna/30 bg-noche-card/80 px-3.5 py-1.5 text-xs text-pergamino font-medium">
            <Sprout size={13} className="text-emerald-400" />
            Simbiosis: Bacteria Rhizobium
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-armuna/30 bg-noche-card/80 px-3.5 py-1.5 text-xs text-pergamino font-medium">
            <Factory size={13} className="text-cyan-400" />
            Presente: Novartis (12,9 M€) &amp; Polígono
          </span>
        </div>
      </div>

      {/* Navegador rápido de bloques */}
      <nav aria-label="Secciones de economía" className="mt-10 rounded-2xl border border-noche-border bg-noche-card/60 p-3.5 sm:p-4 backdrop-blur-xs">
        <p className="text-[11px] uppercase tracking-wider text-piedra-300 font-semibold mb-2.5 px-1">
          Índice cronológico y temático
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className={`flex flex-col items-start p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'border-armuna-light bg-armuna/20 text-pergamino shadow-sm'
                    : 'border-noche-border/60 bg-noche/40 text-pergamino-muted/75 hover:border-piedra-400/40 hover:text-pergamino'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={14} className={isActive ? 'text-armuna-light' : 'opacity-70'} />
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                    {sec.badge.split(' ')[0]}
                  </span>
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-2">
                  {sec.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: SECANO, BUEYES Y LA ROTACIÓN A DOS HOJAS */}
      {/* ========================================================================= */}
      <section
        id="secano-bueyes"
        ref={(el) => (sectionRefs.current['secano-bueyes'] = el)}
        className="mt-12 pt-6 scroll-mt-20"
      >
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
              <Wheat size={14} /> 1. El sistema agrario tradicional
            </span>
            <span className="text-xs font-mono text-piedra-300/80">Secano · Altitud 800–900 m</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            Secano, bueyes y la rotación «a dos hojas»
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            Históricamente, la base socioeconómica de Moriscos y de su entorno inmediato ha estado estrictamente condicionada por las características geomorfológicas de la <strong>penillanura aluvial de la submeseta superior</strong>, situada a una cota de entre <strong>800 y 900 metros</strong> sobre el nivel del mar. Con un clima mediterráneo continentalizado de inviernos gélidos, heladas tardías y veranos prolongados y secos, sus tierras franco-arenosas y arcillosas presentaban un contenido medio de materia orgánica extremadamente bajo, en torno al <strong className="text-amber-300">0,97%</strong>.
          </p>

          {/* Imagen ilustrativa integrada */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-noche-border/80 bg-noche/80">
            <img
              src={getImg('images/moriscos-cosecha-alpacas.jpg')}
              alt="Labores agrícolas de cosecha y alpacas en el campo de Moriscos"
              className="w-full h-56 sm:h-72 object-cover"
              loading="lazy"
            />
            <div className="p-3 sm:p-4 text-xs text-pergamino-muted/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-t border-noche-border/60">
              <span>🌾 El campo cerealista de Moriscos: herencia directa de los antiguos trigales armuñeses.</span>
              <span className="text-piedra-300/70 font-mono">Foto: Pablo Crespo Bellido · 15 de julio de 2025</span>
            </div>
          </div>

          {/* Puntos clave */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-noche-border/80 bg-noche/70 p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm mb-2">
                I
              </div>
              <h3 className="text-sm font-bold text-pergamino mb-1">La labor «a dos hojas»</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                El término se dividía anualmente en dos mitades (año y vez). Mientras una hoja se sembraba de cereal o legumbres, la otra permanecía rigurosamente en <em>barbecho</em> para que el suelo descansase y pudiera recargar humedad y nutrientes naturales.
              </p>
            </div>

            <div className="rounded-2xl border border-noche-border/80 bg-noche/70 p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm mb-2">
                II
              </div>
              <h3 className="text-sm font-bold text-pergamino mb-1">Fuerza de tiro: Bueyes vs Mulas</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                Una singular <strong>frontera etnográfica</strong>: en La Armuña y la Tierra de Charra se labraba históricamente con <strong>bueyes de labor</strong> (por su aplomo en tierras pesadas), a diferencia de comarcas contiguas como Peñaranda y Cantalapiedra, donde predominaban las mulas.
              </p>
            </div>

            <div className="rounded-2xl border border-noche-border/80 bg-noche/70 p-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm mb-2">
                III
              </div>
              <h3 className="text-sm font-bold text-pergamino mb-1">El trigal dominante</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                El <strong>trigo candeal, mocho y rubión</strong> era el pilar de la subsistencia humana. La cebada, la avena y el centeno se reservaban para la cabaña vacuna, lanar y porcina. En pueblos vecinos como <em>Calzada de Valdunciel</em>, el centeno quedaba arrinconado a pequeñas parcelas marginales.
              </p>
            </div>
          </div>

          {/* Vocabulario de la labor */}
          <div className="mt-6 rounded-2xl border border-armuna/30 bg-noche-surface/70 p-4 sm:p-5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-armuna-light mb-3 flex items-center gap-1.5">
              <BookOpen size={14} /> Léxico tradicional de la faena armuñesa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-noche/60 border border-noche-border/50">
                <span className="font-bold text-pergamino text-sm block">«Alzar»</span>
                <span className="text-pergamino-muted/75">
                  Dar la primera y más penosa labor de arado a los barbechos tras el descanso estival, requiriendo el tiro vigoroso del yugo de bueyes.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-noche/60 border border-noche-border/50">
                <span className="font-bold text-pergamino text-sm block">«Aricar»</span>
                <span className="text-pergamino-muted/75">
                  Labor superficial de escarda destinada a arrimar tierra a las plantas en crecimiento, airear las raíces y erradicar las malas hierbas.
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-noche/60 border border-noche-border/50">
                <span className="font-bold text-pergamino text-sm block">«La Boyá»</span>
                <span className="text-pergamino-muted/75">
                  El rebaño mancomunado de bueyes y vacas del pueblo que el boyero del concejo conducía a diario hacia los pastos comunales.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-piedra-300/80 pt-2 border-t border-noche-border/50">
            <span>Fuentes: <em>«Historia económica de Moriscos y La Armuña»</em> &bull; <em>«Análisis histórico multidimensional»</em> &bull; <em>«Léxico de Mozodiel»</em></span>
            <button
              type="button"
              onClick={() => scrollTo('fuentes-referencias')}
              className="text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              Ver citas [24–27, 98–106] <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: EL MILAGRO DE LA LENTEJA DE LA ARMUÑA */}
      {/* ========================================================================= */}
      <section
        id="lenteja-gorgojo"
        ref={(el) => (sectionRefs.current['lenteja-gorgojo'] = el)}
        className="mt-12 pt-6 scroll-mt-20"
      >
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
              <Sprout size={14} /> 2. El milagro agronómico y la batalla biológica
            </span>
            <span className="text-xs font-mono text-piedra-300/80">Lenteja Rubia · Garbanzo de Pedrosillo</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            El milagro biológico de la Lenteja de La Armuña y el control del gorgojo
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            La gran singularidad productiva que encumbró internacionalmente a La Armuña fue su paulatina especialización en leguminosas de altísimo valor: la <strong>Lenteja de La Armuña</strong> (variedad <em>Rubia de La Armuña</em> o <em>Lens culinaris Medicus</em>, de calibre excepcional de <strong>5 a 7 mm</strong>, apodada históricamente por los agricultores locales como la <em>«gigante de Gomecello»</em>) y el <strong>Garbanzo de Pedrosillo</strong>.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Simbiosis Rhizobium */}
            <div className="rounded-2xl border border-emerald-500/30 bg-noche/75 p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
                <FlaskConical size={18} />
                <span>Fertilización natural: Simbiosis con Rhizobium</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                Estas legumbres cumplían un papel agronómico esencial en el secano. Gracias a la <strong>simbiosis con bacterias del género <em>Rhizobium</em></strong> albergadas en sus nódulos radiculares, capturaban el nitrógeno atmosférico libre y lo fijaban directamente en el subsuelo. Este abono biológico gratuito regeneraba la tierra agotada, logrando que los trigos y cebadas sembrados en la rotación del año siguiente alcanzaran rendimientos sobresalientes sin necesidad de fertilización química.
              </p>
            </div>

            {/* La plaga del gorgojo */}
            <div className="rounded-2xl border border-red-500/30 bg-noche/75 p-5">
              <div className="flex items-center gap-2 mb-2 text-rose-400 font-bold text-sm">
                <Info size={18} />
                <span>La secular maldición del gorgojo</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                Pese a su excelencia gastronómica, durante los siglos XVII y XVIII la lenteja fue un cultivo minoritario. El motivo era demoledor: la plaga del <strong>gorgojo</strong> agujereaba e inutilizaba las cosechas a las pocas semanas de la trilla, reduciendo drásticamente la producción en favor de los garbanzos y las algarrobas (<em>garrobas</em>), mucho más resistentes al insecto.
              </p>
            </div>
          </div>

          {/* Métodos de lucha */}
          <div className="mt-6 rounded-2xl border border-noche-border/80 bg-noche/70 p-5">
            <h3 className="text-sm font-bold text-pergamino mb-3">
              De las tinajas con aceite a los «asfixies» con bobolina (S. XX)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed text-pergamino-muted/85">
              <div className="p-3.5 rounded-xl border border-noche-border/60 bg-noche/50">
                <span className="font-bold text-amber-300 block mb-1">1. Tinajas en aceite (S. XVIII)</span>
                Las familias acomodadas sumergían las lentejas en grandes tinajas repletas de aceite de oliva (porteado en odres por trajineros desde la Sierra de Gata). El aceite aislaba el grano, pero constituía un método inviable y costoso para los campesinos humildes.
              </div>
              <div className="p-3.5 rounded-xl border border-noche-border/60 bg-noche/50">
                <span className="font-bold text-amber-300 block mb-1">2. El tostado de Calzada</span>
                En Calzada de Valdunciel, el herrero local <strong>D. Gonzalo Sánchez</strong> ideó una ingeniosa máquina secreta para tostar ligeramente la lenteja y abrasar las larvas del insecto antes de que eclosionasen.
              </div>
              <div className="p-3.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10">
                <span className="font-bold text-emerald-300 block mb-1">3. Los «Asfixies» y la bobolina</span>
                A comienzos del siglo XX llegó la gran revolución técnica: los <strong>asfixies</strong>, habitáculos herméticos donde se confinaban los sacos de lentejas y se introducía el compuesto líquido llamado <em>«bobolina»</em>. La anoxia fulminaba al gorgojo sin alterar la calidad del grano, permitiendo la venta masiva en los mercados de Salamanca y España.
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-piedra-300/80 pt-2 border-t border-noche-border/50">
            <span>Fuentes: <em>«Historia económica de Moriscos y La Armuña»</em> &bull; <em>«Léxico de Mozodiel de Sanchíñigo»</em></span>
            <button
              type="button"
              onClick={() => scrollTo('fuentes-referencias')}
              className="text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              Ver citas [27–28, 100–118] <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 3: LAS ECONOMÍAS FLUVIALES: ACEÑAS EN EL TORMES */}
      {/* ========================================================================= */}
      <section
        id="aceñas-tormes"
        ref={(el) => (sectionRefs.current['aceñas-tormes'] = el)}
        className="mt-12 pt-6 scroll-mt-20"
      >
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300">
              <Waves size={14} /> 3. Las economías fluviales
            </span>
            <span className="text-xs font-mono text-piedra-300/80">Río Tormes · Cabrerizos &bull; La Flecha</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            La molienda de las aceñas en el Tormes y el tributo de la maquila
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            En los términos ribereños del río Tormes colindantes al sur de Moriscos —muy singularmente en <strong>Cabrerizos</strong> y el paraje histórico de <strong>La Flecha</strong>—, la economía tradicional armuñesa dejaba de ser exclusivamente de secano. El verdadero corazón de riqueza radicaba en la fuerza motriz de la corriente fluvial: la <strong>molienda en las aceñas hidráulicas</strong>.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-noche-border/80 bg-noche/70 p-5">
              <h3 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
                <Building2 size={16} /> Monopolio de la cantería y poder señorial
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                La construcción y el mantenimiento de las aceñas de cantería y sus pesqueras de piedra exigían un capital inmenso. Por ello, constituyeron un <strong>lucrativo monopolio</strong> en manos del <em>Cabildo Catedralicio de Salamanca</em> (como el Chantre Pedro en 1240) y de la oligarquía de la capital. Regidores salmantinos como <strong>Juan Vázquez Coronado y Gonzalo de Villafuerte</strong> sostuvieron enconadas disputas por apropiarse de las muelas que procesaban el trigo de toda La Armuña.
              </p>
            </div>

            <div className="rounded-2xl border border-noche-border/80 bg-noche/70 p-5">
              <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
                <Wheat size={16} /> La Maquila: de molineros a panaderos
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                El pago de la molienda jamás se satisfacía en dinero metálico, sino en especie: la llamada <strong>maquila</strong>, estipulada habitualmente en la <strong>1/12 parte de la fanega</strong> (un celemín de harina o grano por cada fanega entregada). Esta tasa impositiva permitió que los molineros acumularan colosales remanentes de harina, transformándose de manera natural en los <strong>panaderos</strong> de Moriscos y Castellanos de Moriscos.
              </p>
            </div>
          </div>

          {/* Aprovechamientos complementarios del soto */}
          <div className="mt-6 rounded-2xl border border-cyan-500/25 bg-noche-surface/70 p-4 sm:p-5">
            <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-300 mb-3 flex items-center gap-1.5">
              <Waves size={14} /> Usos cotidianos del río para los vecinos de Moriscos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-pergamino-muted/85 leading-relaxed">
              <div className="p-3 rounded-xl bg-noche/60 border border-noche-border/50">
                <strong className="text-pergamino block mb-1">Pastos invernales de bueyes</strong>
                Durante los rigores del invierno, los labradores de Moriscos descendían sus yuntas de bueyes a pastar al soto verde y resguardado de La Flecha, evitando el agotamiento de las dehesas secas del páramo.
              </div>
              <div className="p-3 rounded-xl bg-noche/60 border border-noche-border/50">
                <strong className="text-pergamino block mb-1">El agua blanda para guisar</strong>
                Los pozos de Moriscos producían agua sumamente caliza y salobre que superaba los <strong>40º de dureza</strong>. Para cocer los garbanzos y lentejas sin que endurecieran, los vecinos acudían al río a acarrear cántaros de «agua blanda».
              </div>
              <div className="p-3 rounded-xl bg-noche/60 border border-noche-border/50">
                <strong className="text-pergamino block mb-1">Pesca de ranas y silleteros</strong>
                Los sotos ribereños eran fuente de pesca de ranas y recolección de eneas y esparto por artesanos populares como <em>«Miguel el Silletero»</em>, quien abastecía de asientos de esparto a toda la comarca.
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-piedra-300/80 pt-2 border-t border-noche-border/50">
            <span>Fuentes: <em>«Historia - Ayto Cabrerizos»</em> &bull; <em>«RUTA A LA FLECHA-GUION.docx»</em></span>
            <button
              type="button"
              onClick={() => scrollTo('fuentes-referencias')}
              className="text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              Ver citas [19–23, 151–156] <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 4: RADIOGRAFÍA DE MADOZ (S. XIX) Y EL FERROCARRIL (1877) */}
      {/* ========================================================================= */}
      <section
        id="madoz-tren-silos"
        ref={(el) => (sectionRefs.current['madoz-tren-silos'] = el)}
        className="mt-12 pt-6 scroll-mt-20"
      >
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-300">
              <Train size={14} /> 4. La metamorfosis del transporte y los graneros
            </span>
            <span className="text-xs font-mono text-piedra-300/80">1845 (Madoz) &bull; 1877 (Tren) &bull; 1949–1990 (Silos)</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            El impacto de la radiografía de Madoz (S. XIX) y el ferrocarril (1877)
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            A mediados del siglo XIX, la subsistencia en la comarca continuaba encorsetada en la precariedad rural. El célebre <em>Diccionario geográfico-estadístico-histórico de España</em> de <strong>Pascual Madoz (1845–1850)</strong> describe un escenario de dura modestia:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-noche-border/80 bg-noche/75 p-5">
              <div className="flex items-center gap-2 mb-2 text-orange-300 font-bold text-sm">
                <Quote size={16} />
                <span>Moriscos y Castellanos según Pascual Madoz</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                En <strong>Castellanos de Moriscos</strong> se contabilizaban apenas 72 «casas mezquinas» para 312 vecinos. Por su parte, <strong>Moriscos</strong> disponía de unas <strong>40 viviendas sencillas</strong> dependientes por entero de la excavación de pozos hondos y de una gran <strong>charca comunal</strong> (la mítica charca concejil) donde se abrevaba al ganado de labor.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-noche/75 p-5">
              <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-sm">
                <Train size={16} />
                <span>La revolución ferroviaria de 1877</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
                El 26 de agosto de 1877, la inauguración de la línea férrea <strong>Medina del Campo–Salamanca</strong> y la entrada en servicio de la <strong>Estación de Moriscos</strong> desmantelaron el secular aislamiento del transporte a tracción de sangre. Por primera vez en la historia, el trigo, la cebada y las legumbres armuñesas podían exportarse de forma masiva y veloz hacia los puertos del Cantábrico y el gran mercado madrileño.
              </p>
            </div>
          </div>

          {/* Los Silos de la Red Nacional */}
          <div className="mt-6 rounded-2xl border border-noche-border/80 bg-noche/70 p-5">
            <h3 className="text-sm font-bold text-pergamino mb-2 flex items-center gap-2">
              <Building2 size={16} className="text-orange-400" />
              Silos de hormigón armado de la Red Nacional (1949–1990)
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80">
              Gracias al paso estratégico del ferrocarril, <strong>Gomecello</strong> y <strong>Moriscos</strong> fueron designados centros de acopio prioritarios bajo la <strong>Red Nacional de Silos y Graneros</strong> creada por el Servicio Nacional del Trigo. Durante más de cuatro décadas, las monumentales moles de hormigón armado levantadas junto a las vías almacenaron miles de toneladas de grano con el fin de regular los precios de intervención estatal y garantizar el suministro panificable nacional, hasta su privatización y posterior subasta pública por el FEGA en 2021.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-piedra-300/80 pt-2 border-t border-noche-border/50">
            <span>Fuentes: <em>«Diccionario de Madoz»</em> &bull; <em>«Historia económica de Moriscos»</em> &bull; <em>«Silos de Gomecello»</em></span>
            <button
              type="button"
              onClick={() => scrollTo('fuentes-referencias')}
              className="text-orange-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              Ver citas [17, 33, 158–159] <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 5: SIGLO XXI: INDUSTRIALIZACIÓN Y NOVARTIS */}
      {/* ========================================================================= */}
      <section
        id="siglo-xxi-novartis"
        ref={(el) => (sectionRefs.current['siglo-xxi-novartis'] = el)}
        className="mt-12 pt-6 scroll-mt-20"
      >
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-300">
              <Factory size={14} /> 5. Siglo XXI: Metamorfosis industrial y residencial
            </span>
            <span className="text-xs font-mono text-piedra-300/80">Área Metropolitana · Novartis · Calidad I.G.P.</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            Siglo XXI: Industrialización, Novartis y periurbanización metropolitana
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            En las últimas décadas, la comarca ha vivido una de las transformaciones más vertiginosas de Castilla y León, consolidándose como un enclave residencial, logístico e industrial puntero integrado en el área periurbana de Salamanca. La antigua exclusividad del arado ha dejado paso a un ecosistema diversificado de vanguardia:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-blue-500/30 bg-noche/75 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Biotecnología oncológica
              </span>
              <h3 className="text-base font-bold text-pergamino mb-2">Novartis (12,9 M€)</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                La multinacional farmacéutica suiza <strong>Novartis</strong> apostó por el Polígono Industrial de Castellanos de Moriscos con una inversión de <strong>12,9 millones de euros</strong> para su planta de radioligandos: medicamentos oncológicos personalizados de alta precisión que atraen empleo biotecnológico altamente cualificado.
              </p>
            </div>

            <div className="rounded-2xl border border-noche-border/80 bg-noche/75 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-piedra-300 block mb-1">
                Industria y Servicios
              </span>
              <h3 className="text-base font-bold text-pergamino mb-2">Helcesa &amp; CTR Gomecello</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                El tejido fabril acoge enseñas históricas como <strong>Helcesa</strong> (establecida en 1984 para manufactura de precisión en acero inoxidable para la industria cárnica del jamón y porcino) y el <strong>Centro de Tratamiento de Residuos (CTR)</strong> provincial de Gomecello, operativo desde 2007.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-noche/75 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Excelencia Agroalimentaria
              </span>
              <h3 className="text-base font-bold text-pergamino mb-2">I.G.P. &amp; Legumbres Montes</h3>
              <p className="text-xs leading-relaxed text-pergamino-muted/80">
                El sector agrícola se ha modernizado bajo estrictos sellos: el <strong>Centro de la Legumbre</strong> en Pajares de la Laguna tutela la <em>I.G.P. Lenteja de La Armuña</em> y la <em>M.G. Garbanzo de Pedrosillo</em>. Empresas familiares como <strong>Legumbres Montes</strong> (La Vellés) y <strong>Legumer Precocinados</strong> llevan el sabor armuñés a la exportación internacional.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-noche-border/80 bg-noche/60 p-4 text-xs text-pergamino-muted/80 flex items-center gap-3">
            <Info size={18} className="text-blue-400 shrink-0" />
            <p>
              El crecimiento demográfico acompaña esta transformación: municipios colindantes como Cabrerizos han rebasado los 4.200 habitantes, y Moriscos y Castellanos han multiplicado sus censos residenciales por su proximidad a la autovía A-62 y la capital salmantina.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-piedra-300/80 pt-2 border-t border-noche-border/50">
            <span>Fuente: <em>«Historia económica de Moriscos y la comarca de La Armuña»</em></span>
            <button
              type="button"
              onClick={() => scrollTo('fuentes-referencias')}
              className="text-blue-300 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              Ver citas [16, 34–38, 44, 54] <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECCIÓN 6: CATÁLOGO DE FUENTES Y REFERENCIAS DOCUMENTALES */}
      {/* ========================================================================= */}
      <section
        id="fuentes-referencias"
        ref={(el) => (sectionRefs.current['fuentes-referencias'] = el)}
        className="mt-14 pt-8 border-t border-noche-border/80 scroll-mt-20"
      >
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-noche-card/80 to-noche-card p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-300">
              <BookOpen size={14} /> 6. Aparato crítico y fuentes documentales
            </span>
            <span className="text-xs font-mono text-piedra-300/80">Documentación &bull; Archivos &bull; Citas</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-pergamino">
            Fuentes históricas y referencias de la investigación
          </h2>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-pergamino-muted/90">
            Para garantizar el máximo rigor documental sobre el sustento histórico de Moriscos y La Armuña, a continuación se desglosa el aparato crítico exhaustivo identificando el documento de origen y los datos precisos extraídos de cada uno:
          </p>

          <div className="mt-6 space-y-4">
            {sourcesData.map((src, idx) => (
              <article
                key={src.id}
                className="rounded-2xl border border-noche-border/80 bg-noche/75 p-5 transition-all hover:border-purple-400/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-pergamino flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-bold">
                      {idx + 1}
                    </span>
                    {src.title}
                  </h3>
                  <span className="inline-flex items-center self-start sm:self-auto rounded-md bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-purple-200">
                    {src.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-pergamino-muted/80 mt-2">
                  {src.summary}
                </p>

                {src.temas && src.temas.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-noche-border/40 text-xs">
                    <span className="text-[11px] font-semibold text-armuna-light uppercase tracking-wider mr-1">
                      Materias tratadas:
                    </span>
                    {src.temas.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-md bg-noche-card/90 border border-piedra-400/25 px-2 py-0.5 text-[11px] font-medium text-pergamino-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-armuna/30 bg-noche-surface/80">
            <div className="text-xs text-pergamino-muted/80">
              ¿Deseas contrastar todas las referencias bibliográficas y notariales completas de la web?
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('referencias')}
                className="btn-secondary text-xs sm:text-sm whitespace-nowrap cursor-pointer"
              >
                <span>Ir al catálogo general de Referencias</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
