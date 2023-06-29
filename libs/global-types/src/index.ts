declare global {
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
}

export {};
