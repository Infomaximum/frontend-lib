interface Infomaximum {
  system: {
    /** Префикс пути для загрузки ресурсов */
    apiPrefix: string;
    /** Префикс для разделения пути для загрузки данных */
    basePrefix: string;
  };
}

interface Window {
  im: Infomaximum;
}

/** Импортировать svg в base64 */
declare module "*.svg?url" {
  const srcSvgUrl: string;
  export default srcSvgUrl;
}

/** Импортировать svg как компонент реакта */
declare module "*.svg" {
  const srcSvg: React.FC<React.SVGAttributes<SVGElement>>;

  export default srcSvg;
}
