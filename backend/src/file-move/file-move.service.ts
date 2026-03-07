import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { join } from 'path';

@Injectable()
export class FileMoveService {
  private readonly logger = new Logger('Очиститель файлов');

  private uploadUrl = join(__dirname, '..', '..', 'public', 'uploads');
  private imagesUrl = join(__dirname, '..', '..', 'public', 'images');

  async moveFile(nameInUpload: string) {
    if (!this.isValidPath(nameInUpload)) {
      throw new BadRequestException('путь не валиден');
    }
    const oldPath = join(this.uploadUrl, nameInUpload);
    const newPath = join(this.imagesUrl, nameInUpload);
    return await fs.rename(oldPath, newPath);
  }

  isValidPath(path: string) {
    return !(
      path.includes('/') ||
      path.includes('\\') ||
      path.includes('..') ||
      path.includes('~') ||
      path.includes(' ') ||
      path.includes("'")
    );
  }

  @Cron('*/3 * * * *')
  async cleanupOldFiles() {
    try {
      try {
        await fs.access(this.uploadUrl);
      } catch {
        this.logger.error(
          `Папка ${this.uploadUrl} не существует или доступна для записи`,
        );
        return;
      }
      // Получаем список файлов
      const files = await fs.readdir(this.uploadUrl);
      const now = Date.now();
      const THREE_MINUTES = 3 * 60 * 1000;

      for (const file of files) {
        const filePath = join(this.uploadUrl, file);

        try {
          const stats = await fs.stat(filePath);
          const fileAge = now - stats.mtimeMs;

          // Удаляем файлы старше 3 минут
          if (fileAge > THREE_MINUTES) {
            await fs.unlink(filePath);
          }
        } catch (error) {
          this.logger.error(
            `Ошибка при обработке файла ${file}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Ошибка при очистке файлов: ${error.message}`);
    }
  }

  async deleteFile(fileName: string) {
    if (!this.isValidPath) {
      throw new BadRequestException('путь не валиден');
    }

    const path = join(this.imagesUrl, fileName);

    return await fs.unlink(path);
  }
}
