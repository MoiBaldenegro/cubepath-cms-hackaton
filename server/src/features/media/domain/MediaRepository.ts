import { Express } from 'express';

export interface MediaRepository {
  /**
   * Sube una imagen y retorna la URL pública
   * @param file Archivo recibido por Multer
   * @param filename Nombre sugerido para el archivo
   * @returns URL pública de la imagen subida
   */
  uploadImage(file: Express.Multer.File, filename?: string): Promise<string>;
}
