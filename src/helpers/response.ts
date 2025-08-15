import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const handleError = (error: any) => {
  if (error instanceof HttpException) {
    throw error;
  }
  throw new InternalServerErrorException(
    error.message || 'Internal server error',
  );
};

export const succesMessage = (data: object, code = 200) => {
  return {
    statusCode: code,
    message: 'success',
    data,
  };
};
