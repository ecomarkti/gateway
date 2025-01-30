import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

/**
 * @param data es para obtener propiedad que se quiere obtener del usuario, si es vacio retorna todo el usuario
 */
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user) {
    return new InternalServerErrorException('User not found in request');
  }

  return !data ? user : user[data];
});
