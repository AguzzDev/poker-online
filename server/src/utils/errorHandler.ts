import { InternalServerErrorException } from '@nestjs/common';

export function handleError(error: any): never {
  if (error instanceof InternalServerErrorException) {
    throw new InternalServerErrorException('Internal server error');
  }

  throw error;
}
