import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, { metatype }: ArgumentMetadata): number {
    console.log(`ParseIntPipe：value:`, value, 'metatype: ', metatype);

    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('字段校验不通过');
    }
    return val;
  }
}
