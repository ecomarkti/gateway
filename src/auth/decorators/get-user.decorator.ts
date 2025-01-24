import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if ( !user ) {
        return new InternalServerErrorException('User not found in request');
    }

    return ( !data ) ? user : user[data];
});