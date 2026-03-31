declare global {
  namespace JSX {
    interface IntrinsicElements {
      'testimo-widget': {
        'organization-id': string;
        'api-url'?: string;
        theme?: 'light' | 'dark';
        layout?: 'grid' | 'list';
        [key: string]: any;
      };
    }
  }
}

export {}; // Asegura que este archivo sea tratado como módulo
