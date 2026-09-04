import React, { useState } from 'react';
import { navItems } from '../components/Nav';
import { ExternalLink, BookOpen, History } from 'lucide-react';

const eras = [
  {
    id: 'antiguedad',
    title: 'Prehistoria y Edad Antigua',
    subtitle: 'Pueblos prerromanos, calzadas romanas y fronteras germánicas',
    events: [
      {
        year: 'I milenio a. C.',
        title: 'Vettones y vacceos en el Tormes',
        text: 'La penillanura salmantina se halla poblada por pueblos indoeuropeos: los vettones, artífices de los célebres verracos de granito y castros fortificados, y los vacceos en el límite oriental armuñés. En el año 220 a. C., el caudillo cartaginés Aníbal Barca sitia y toma Helmántica (Salamanca). Aunque en el término de Moriscos no se conservan restos paleolíticos directos, en el entorno comarcal destacan los asentamientos del Cerro de San Vicente y los dólmenes de Terradillos.',
        tab: 'libro',
      },
      {
        year: 'Hacia 150 a. C.',
        title: 'Hispania romana y calzadas imperiales',
        text: 'Roma estructura el occidente peninsular mediante una red de calzadas estratégicas: la gran Vía de la Plata (Emérita Augusta–Salmántica–Ocelo Duri–Astúrica), complementada por la Vía Colimbriana (hacia Coímbra) y la Vía Dalmacia. El entorno de Moriscos queda enmarcado como paso natural de campiña entre la calzada de Medina y la vega del río Tormes.',
        tab: 'libro',
      },
      {
        year: 'Siglos III–VIII',
        title: 'Límite fronterizo suevo-visigodo',
        text: 'Tras la fragmentación del imperio romano, las campiñas salmantinas actúan de frontera militar y territorial entre los pueblos germánicos invasores —reino suevo y monarquía visigoda—, antes de la rápida expansión islámica a partir del 711 d. C.',
      },
    ],
  },
  {
    id: 'media',
    title: 'Edad Media (siglos X–XV)',
    subtitle: 'De las aceifas de Almanzor a la repoblación de Alfonso VI y el origen del nombre',
    events: [
      {
        year: '939–986',
        title: 'Ramiro II, Simancas y las aceifas de Almanzor',
        text: 'Durante más de dos siglos, la cuenca del Tormes fue tierra de confrontación y despoblamiento continuo. Tras el triunfo de Simancas (939), Ramiro II de León impulsa una primera línea defensiva repoblando Salamanca y la aldea de Ribas (en el actual término junto a La Flecha). Sin embargo, entre 977 y 986 las devastadoras aceifas del caudillo Almanzor asuelan La Armuña, obligando a replegar a los escasos núcleos cristianos.',
        tab: 'ruta-nocturna',
      },
      {
        year: '1102',
        title: 'Repoblación formal: Alfonso VI y Raimundo de Borgoña',
        text: 'Tras la consolidación cristiana del reino, el rey Alfonso VI encarga formalmente a su yerno, el conde Raimundo de Borgoña, la repoblación de Salamanca, y al obispo Jerónimo de Perigord la reorganización eclesiástica. Se asientan colonos francos, castellanos, asturleoneses, gallegos, vasconavarros y riojanos, estructurando el territorio en Cuartos concejiles con sexmeros recaudadores de alcabalas, pontazgos y sisas.',
        tab: 'libro',
      },
      {
        year: '1164 (4 de octubre)',
        title: 'Primera mención documental de Moriscos',
        text: 'En una escritura de venta de la aldea de Mozodiel al cabildo catedralicio salmantino por diez maravedís de oro, aparece la referencia documental más antigua: «in illa aldeia que vocatur Martín Perna, et recurrit ad collationam Sancti Christofori de Morisco». El obispado confirma que se halla a legua y media de Salamanca en la calzada de Valladolid, con 56 vecinos pecheros, templo de San Pedro y la ermita de Pedrarias.',
        tab: 'iglesia',
      },
      {
        year: '1265',
        title: 'Morisco de Valdevilloria y villa de realengo',
        text: 'El «Libro de todos los préstamos» de la Catedral de Salamanca cataloga la parroquia bajo el nombre de «MORISCO de Valdevilloria». El pueblo goza de condición de realengo (dependiente directamente de la Corona, sin sujeción a señores feudales ni al obispado), destacando en la época por la presencia de un notable gremio de tejedores de paños.',
        tab: 'iglesia',
      },
      {
        year: '1289 (7 de julio)',
        title: 'Escritura de venta en Castellanos de Morisco',
        text: 'Domingo Asensio y su esposa María venden en la «carrera de Lorvada» (término de Castellanos de Morisco) una tierra al canónigo Iohan Yustes en representación del arcediano de Alba, por 36 morabetinos blancos de la guerra. La denominación confirma documentalmente que el núcleo de Moriscos ya daba nombre al asentamiento castellano colindante a finales del siglo XIII.',
        tab: 'libro',
      },
      {
        year: '1398 (8 de abril)',
        title: 'Venta del clérigo de El Hoyo',
        text: 'Juan Martín, clérigo de la aldea de El Hoyo, vende a Domingo Fernández y su mujer Catalina Alfonso una casa, lagar y corral en Morisco por la suma de 140 maravedís, dejando constancia de la estrecha ligazón entre ambos núcleos antes de que El Hoyo se convirtiese en despoblado.',
        tab: 'libro',
      },
      {
        year: 'Siglos XIII–XV',
        title: 'El verdadero origen del topónimo «Moriscos»',
        text: 'El nombre del pueblo no guarda relación con los decretos de expulsión de 1609 ni con las conversiones forzosas de 1502 bajo los Reyes Católicos, pues el topónimo ya figuraba consolidado siglos antes. Como demuestran estudios toponomásticos, responde a pequeños asentamientos andalusíes, mudéjares o mozárabes que permanecieron en la campiña tras el repliegue militar musulmán, en paralelo a otros nombres salmantinos como Morille, Moríñigo, Morenos o Mori.',
        tab: 'escudo',
      },
      {
        year: '1451',
        title: 'Granja Agustina de La Flecha',
        text: 'Se funda la finca y oratorio renacentista de La Flecha Baja, dotada de aceña molinera harinera sobre el río Tormes, que mantendrá un secular intercambio agrario y de molienda con los campesinos de Moriscos.',
        tab: 'ruta-nocturna',
      },
    ],
  },
  {
    id: 'moderna',
    title: 'Edad Moderna (siglos XVI–XVIII)',
    subtitle: 'Emigración a Indias, pleitos concejiles, censos reales y el Catastro de Ensenada',
    events: [
      {
        year: '1517–1700',
        title: 'Emigración morisqueña al Nuevo Mundo',
        text: 'Estudios de la emigración castellano-leonesa documentan a vecinos de Moriscos embarcados en la Carrera de Indias rumbo a América, en busca de nuevas oportunidades en el continente recién explorado.',
      },
      {
        year: '1522–1524',
        title: 'Arrendamientos y economía agropecuaria',
        text: 'Registros notariales salmantinos documentan el arriendo del abono del corral del Mesón de los Toros de Salamanca por una viuda morisqueña y su hijo a cambio de fanegas de cebada, trigo y gallinas, así como el arrendamiento de la dehesa de Los Vales en Ciudad Rodrigo por un vecino de Morisco junto al salmantino Antón Paraíso.',
      },
      {
        year: '1528–1591',
        title: 'Censos de Pecheros y de la Corona de Castilla',
        text: 'El Censo de Pecheros de Carlos I (1528) y el Censo de los Obispos de Felipe II (1587) registran la demografía pechera local. En 1591, el «Concejo de Morisco» cuenta con 106 vecinos: 103 pecheros (contribuyentes), un hidalgo y dos clérigos. El núcleo vecino de El Hoyo mantiene 9 vecinos antes de despoblarse.',
      },
      {
        year: '1594',
        title: 'Pleito de aguas en la Real Chancillería de Valladolid',
        text: 'Litigio entre el Concejo de Moriscos y el de Castellanos de Moriscos. La Chancillería condena a Moriscos a levantar un vallado protector en el camino de Salamanca para evitar que las escorrentías pluviales inunden el casco urbano de Castellanos.',
      },
      {
        year: '1622',
        title: 'Viñedos en término de Morisco',
        text: 'El testamento del labrador Francisco González «el Rojo», vecino de Cabrerizos, constata la compraventa de viñedos en producción dentro del término de Morisco, evidenciando un policultivo tradicional que combinaba cereal con vid.',
      },
      {
        year: '1752',
        title: 'El Catastro del Marqués de la Ensenada',
        text: 'La magna encuesta fiscal de Ensenada ofrece una fotografía exacta de Moriscos: villa de realengo dependiente de la jurisdicción salmantina, con término limítrofe con Velasco Muñoz, Aldearrubia, El Hoyo, Salamanca y Castellanos, con agricultura dominada por trigo candeal, cebada y zumaque para curtidos.',
        tab: 'iglesia',
      },
      {
        year: '1787',
        title: 'Nomenclátor de Floridablanca',
        text: 'El censo oficial de Floridablanca inscribe formalmente a Morisco como lugar encuadrado en el Cuarto de Valdevilloria dentro del Partido de Salamanca.',
      },
    ],
  },
  {
    id: 'xix',
    title: 'Siglo XIX',
    subtitle: 'La invasión napoleónica, Madoz, el ferrocarril de 1877 y la tormenta de 1890',
    events: [
      {
        year: '1812 (20–22 de junio)',
        title: 'Combates de Moriscos: antesala de Los Arapiles',
        text: 'En los prolegómenos de la Batalla de Los Arapiles, el mariscal francés Marmont fortifica las lomas de Moriscos y los «Parapetos» de La Cabaña. El 20 de junio, el 68.º Regimiento Ligero aliado resiste el asalto napoleónico en el casco urbano sufriendo 50 bajas. El día 22, Wellington lanza al 51.º Ligero y a la Legión Alemana del Rey para expulsar a bayoneta a los franceses hacia Aldearrubia.',
        tab: 'ruta-nocturna',
      },
      {
        year: '1812 (julio–noviembre)',
        title: 'El martirio del pueblo y la crónica del cura Palomero',
        text: 'El párroco Francisco Palomero Ábila dejó testimonio desgarrador: las tropas francesas asaltaron el templo, robaron cálices y alhajas de plata, profanaron el sagrario y sentenciaron al cura a la hoguera, librándose in extremis aunque siendo apaleado y despojado en plena calle. La iglesia fue convertida en establo de caballos tres veces, los libros parroquiales fueron destrozados y la población huyó a vivir a la intemperie en el término de Velasco Muñoz, subsistiendo a base de raíces y hierbas cocidas.',
        tab: 'iglesia',
      },
      {
        year: '1833',
        title: 'Configuración municipal actual e integración de El Hoyo y La Cruz',
        text: 'Con la reforma territorial de Javier de Burgos desaparecen los cuartos y sexmos medievales. Moriscos queda constituido en municipio constitucional e integra definitivamente en su jurisdicción los términos de los antiguos despoblados de El Hoyo y La Cruz.',
      },
      {
        year: '1837–1841',
        title: 'Abolición de diezmos y primicias eclesiásticas',
        text: 'Las leyes desamortizadoras y tributarias del Estado liberal suprimen la exacción obligatoria de diezmos (la décima parte de las cosechas) a favor de la Iglesia, aliviando la carga secular sobre los campesinos morisqueños.',
      },
      {
        year: '1846–1850',
        title: 'Moriscos en el Diccionario de Pascual Madoz',
        text: 'Madoz describe el pueblo con unas 40 casas de secano, una iglesia parroquial de primer ascenso bajo la advocación de San Pedro, varios pozos y una charca de llovedizas, sumando 37 vecinos y 173 almas con una riqueza imponible de 889.092 reales.',
      },
      {
        year: '1877 (26 de agosto)',
        title: 'Apertura de la estación de ferrocarril',
        text: 'Se inaugura el tramo El Pedroso–Salamanca de la línea férrea Medina del Campo–Salamanca, siendo la de Moriscos la primera estación tras la capital. El tren permite exportar grano y legumbres a toda España, naciendo el barrio de La Estación.',
        tab: 'libro',
      },
      {
        year: '1888 (21 de enero)',
        title: 'Deslinde y amojonamiento municipal',
        text: 'El Ayuntamiento acuerda el amojonamiento riguroso de todos los caminos, cañadas públicas, veredas y abrevaderos del municipio para poner freno a las roturaciones abusivas de terrenos comunales.',
      },
      {
        year: '1890 (1 de octubre)',
        title: 'La gran tormenta de pedrisco: el tren de socorro',
        text: 'Una pavorosa granizada asola Moriscos, acumulando capas de hielo de casi un metro de altura. Se hunden 4 casas por completo y otras 15 quedan semiderruidas, inundándose las paneras con pérdida total de cosechas. Gran parte de los vecinos salvan la vida refugiándose en la iglesia. Desde Salamanca se envía un tren especial de socorro con el Gobernador, médicos y la cúpula provincial.',
        tab: 'lugares',
      },
    ],
  },
  {
    id: 'xx',
    title: 'Siglos XX y XXI',
    subtitle: 'Modernización agraria, segregación municipal de 1982 e integración metropolitana',
    events: [
      {
        year: '1931',
        title: 'El voto solemne a la Virgen de la Peregrina',
        text: 'Una familia morisqueña organiza las fiestas patronales tras salvarse un pariente de una enfermedad mortal cumpliendo una promesa religiosa, celebrándose una de las festividades más concurridas y memorables de la historia del pueblo.',
        tab: 'fiestas',
      },
      {
        year: '1936',
        title: 'Cruz de los Caídos en el atrio',
        text: 'Tras el estallido de la Guerra Civil se coloca en el atrio parroquial la Cruz con el nombre del único vecino morisqueño caído: Jesús García Marcos (nacido en 1911).',
      },
      {
        year: '1941 (15 de agosto)',
        title: 'El suceso de la «horca de Marino»',
        text: 'Episodio de crónica de posguerra: un apero de cuatro púas es utilizado en una violenta agresión nocturna contra las hermanas Salvador Domínguez y su criada al regreso de Aldealengua, caso judicial que sentó jurisprudencia en la Audiencia de Salamanca.',
        tab: 'libro',
      },
      {
        year: '1966',
        title: 'Llegada de la primera red telefónica',
        text: 'Se instala la primera centralita con teléfonos a manivela gracias a un préstamo del Banco Central de 1964 avalado con garantía personal por el alcalde y el fabricante chacinero Manuel Hernández Garrote.',
      },
      {
        year: '1968',
        title: 'Primeras pavimentaciones y Concentración Parcelaria',
        text: 'Se asfaltan las calles hacia Aldealengua y el Camino de los Villares, aportando los vecinos el acarreo de piedra para la firmeza de la caja. Culmina la Concentración Parcelaria, reorganizando las fincas agrícolas de secano.',
      },
      {
        year: '1973–1974',
        title: 'Mejoras viales y juego de pelota',
        text: 'Se asfalta el frontón municipal de pelota a mano con subvención de Deportes y se ejecuta el firme del camino hacia Castellanos con emulsión asfáltica.',
      },
      {
        year: '1976 (7 de enero)',
        title: 'Anexión a Castellanos de Moriscos',
        text: 'Por decreto administrativo se acuerda la fusión forzosa de los municipios de Moriscos y San Cristóbal de la Cuesta dentro de Castellanos de Moriscos, perdiendo transitoriamente su autogobierno.',
      },
      {
        year: '1982 (1 de febrero)',
        title: 'Segregación e independencia municipal de Moriscos',
        text: 'Por Real Decreto 236/1982 (publicado en el BOE del 10 de febrero de 1982) se aprueba la segregación definitiva de Moriscos, recuperando su ayuntamiento propio e iniciando el gran proyecto de alcantarillado y agua potable.',
      },
      {
        year: '1983',
        title: 'Supresión del paso a nivel ferroviario',
        text: 'RENFE suprime el histórico paso a nivel del camino a Castellanos, modernizando la seguridad del trazado viario.',
      },
      {
        year: '2014',
        title: 'Conexión a la Red de Agua de Salamanca',
        text: 'Una inversión de casi 600.000 euros conecta el abastecimiento urbano de Moriscos directamente a la Red de Abastecimiento de Salamanca, garantizando agua tratada y de máxima calidad a toda la población.',
      },
      {
        year: 'Actualidad',
        title: 'Renacimiento metropolitano y preservación de la memoria',
        text: 'Moriscos supera hoy los 500 habitantes, combinando su carácter residencial con el desarrollo de fibra óptica, polideportivos, las Rutas Armuñesas y la preservación de su patrimonio gracias a iniciativas vecinales, la Asociación de Mujeres y el portal histórico Morisqueños.',
        tab: 'sobre-la-web',
      },
    ],
  },
];

export default function HistoriaPage({ onNavigate }) {
  const [selectedEra, setSelectedEra] = useState('all');

  const visibleEras = selectedEra === 'all'
    ? eras
    : eras.filter((e) => e.id === selectedEra);

  const totalEvents = eras.reduce((acc, curr) => acc + curr.events.length, 0);

  return (
    <div className="container-editorial py-10 sm:py-16">
      <p className="kicker flex items-center gap-1.5 text-armuna-light">
        <History size={16} />
        Eje cronológico documentado
      </p>
      <h1 className="mt-2 text-balance font-serif text-3xl sm:text-5xl font-bold text-pergamino">
        Historia de Moriscos
      </h1>
      <p className="mt-4 text-balance text-base sm:text-lg leading-relaxed text-pergamino-muted/80">
        Mil años de memoria viva: de las calzadas romanas y las incursiones de Almanzor a la repoblación de Alfonso VI en 1102, el martirio de la invasión francesa de 1812 y la independencia municipal contemporánea por Real Decreto.
      </p>

      {/* Reconocimiento especial a la web Morisqueños */}
      <div className="mt-8 rounded-2xl border border-armuna/30 bg-noche-surface/80 p-4 sm:p-5 shadow-lg backdrop-blur-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-pergamino-muted/85 leading-relaxed">
          <p>
            <strong className="text-armuna-light font-serif text-base block mb-0.5">Fuente documental destacada:</strong>
            Muchos de los legajos, fechas documentadas y transcripciones históricas que componen esta cronología se han recopilado y contrastado a partir de la labor de investigación del portal{' '}
            <strong className="text-pergamino">Morisqueños</strong> en su sección de{' '}
            <a
              href="https://sites.google.com/view/morisquenos/resena-historica"
              target="_blank"
              rel="noopener noreferrer"
              className="text-armuna-light font-semibold hover:underline inline-flex items-center gap-1"
            >
              Reseña Histórica <ExternalLink size={13} />
            </a>.
          </p>
        </div>
      </div>

      {/* Selector de épocas */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedEra('all')}
          className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            selectedEra === 'all'
              ? 'bg-armuna-light text-noche font-bold shadow-md'
              : 'border border-noche-border bg-noche-surface/60 text-pergamino-muted/70 hover:text-pergamino'
          }`}
        >
          Todas las épocas ({totalEvents})
        </button>
        {eras.map((era) => (
          <button
            key={era.id}
            type="button"
            onClick={() => setSelectedEra(era.id)}
            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedEra === era.id
                ? 'bg-armuna-light text-noche font-bold shadow-md'
                : 'border border-noche-border bg-noche-surface/60 text-pergamino-muted/70 hover:text-pergamino'
            }`}
          >
            {era.title.split('(')[0].trim()} ({era.events.length})
          </button>
        ))}
      </div>

      {/* Contenedor del eje cronológico */}
      <div className="mt-12 space-y-12">
        {visibleEras.map((era) => (
          <div key={era.id} className="card-editorial p-6 sm:p-8">
            <div className="border-b border-noche-border pb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-armuna-light">
                {era.title}
              </h2>
              {era.subtitle && (
                <p className="mt-1 text-xs sm:text-sm text-pergamino-muted/70">
                  {era.subtitle}
                </p>
              )}
            </div>

            <div className="mt-8 space-y-8">
              {era.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start group border-b border-noche-border/40 pb-6 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono text-xs sm:text-sm font-bold text-piedra-200 bg-noche-card px-3 py-1.5 rounded-lg shrink-0 border border-piedra-400/25 shadow-xs">
                    {ev.year}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-pergamino group-hover:text-armuna-light transition-colors">
                      {ev.title}
                    </h3>
                    <p className="mt-2 text-pergamino-muted/85 leading-relaxed text-sm sm:text-base">
                      {ev.text}
                    </p>
                    {ev.tab && (
                      <button
                        type="button"
                        onClick={() => onNavigate(ev.tab)}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-armuna-light hover:text-pergamino transition-colors cursor-pointer"
                      >
                        <BookOpen size={14} />
                        <span>Ver más en {navItems.find((n) => n.id === ev.tab)?.label ?? ev.tab}</span>
                        <span className="text-[11px]">&rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
