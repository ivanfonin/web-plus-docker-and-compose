import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RemoveEmailInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((obj) => {
            if (obj.hasOwnProperty('item')) {
              if (obj.item.hasOwnProperty('owner')) {
                if (obj.item.owner.hasOwnProperty('email')) {
                  delete obj.item.owner.email;
                }
              }
            }
            if (obj.hasOwnProperty('user')) {
              if (obj.user.hasOwnProperty('email')) {
                delete obj.user.email;
              }
            }
            if (obj.hasOwnProperty('owner')) {
              if (obj.owner.hasOwnProperty('email')) {
                delete obj.owner.email;
              }
            }
            if (obj.hasOwnProperty('email')) {
              delete obj.email;
            }
            return obj;
          });
        } else {
          if (data.hasOwnProperty('item')) {
            if (data.item.hasOwnProperty('owner')) {
              if (data.item.owner.hasOwnProperty('email')) {
                delete data.item.owner.email;
              }
            }
          }
          if (data.hasOwnProperty('user')) {
            if (data.user.hasOwnProperty('email')) {
              delete data.user.email;
            }
          }
          if (data.hasOwnProperty('owner')) {
            if (data.owner.hasOwnProperty('email')) {
              delete data.owner.email;
            }
          }
          if (data.hasOwnProperty('email')) {
            delete data.email;
          }
          return data;
        }
      }),
    );
  }
}
