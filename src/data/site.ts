export type Counter = {
  label: string;
  value: string;
  suffix?: string;
  detail: string;
};

export const counters: Counter[] = [
  { label: 'Primera mención documental', value: '1164', detail: '4 de octubre, collationam Sancti Christofori de Morisco' },
  { label: 'Vértice geodésico "Andorra"', value: '871,4', suffix: 'm', detail: 'IGN nº 47879 · punto más alto del término' },
  { label: 'Distancia a Salamanca', value: '9', suffix: 'km', detail: 'A 9 km al este-noreste de la capital' },
  { label: 'Superficie del término', value: '12,08', suffix: 'km²', detail: 'Población 2025 (INE): 577 habitantes' },
];

export const hitos = [
  {
    title: 'Repoblación de 1100',
    year: 'Siglos XI-XII',
    summary:
      'El conde Ramón de Borgoña y el obispo Jerónimo de Perigord repueblan el alfoz salmantino; Vela de Aragón funda la vecina Castellanos de Morisco.',
    href: '/libro/02-toponimia-repoblacion',
  },
  {
    title: 'Batalla de 1812',
    year: 'Guerra de la Independencia',
    summary:
      'Wellington y Marmont combaten en El Parapeto y La Cabaña los días 20 y 22 de junio, antesala de la Batalla de Los Arapiles.',
    href: '/libro/06-conflictos-belicos',
  },
  {
    title: 'El suceso de 1941',
    year: '15 de agosto, posguerra',
    summary:
      'La emboscada de "la horca de Marino" a las hermanas Salvador Domínguez, documentada por la prensa y la memoria civil local.',
    href: '/libro/07-sucesos-cronica-negra',
  },
  {
    title: 'Fray Luis de León',
    year: 'Siglo XVI',
    summary:
      'El soto de La Flecha, a 7,7 km de Moriscos, fue refugio contemplativo del poeta agustino tras su encierro inquisitorial.',
    href: '/libro/05-despoblado-ribas-flecha',
  },
];

export const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Historia', href: '/historia' },
  { label: 'Lugares', href: '/lugares' },
  { label: 'Fiestas', href: '/fiestas' },
  { label: 'El Escudo', href: '/escudo' },
  { label: 'La Iglesia', href: '/iglesia' },
  { label: 'El Libro', href: '/libro' },
  { label: 'Ruta Nocturna', href: '/ruta-nocturna' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Genealogía', href: '/genealogia' },
  { label: 'Glosario', href: '/glosario' },
  { label: 'Referencias', href: '/referencias' },
  { label: 'Sobre la web', href: '/sobre-la-web' },
];
