import { IsString, IsNotEmpty, IsEnum, IsObject, IsOptional } from 'class-validator';
import { WidgetTypeEnum } from '../../../../domain/widget/value-objects/WidgetType';
import { WidgetThemeEnum } from '../../../../domain/widget/value-objects/WidgetTheme';

export class CreateWidgetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(WidgetTypeEnum)
  type: WidgetTypeEnum;

  @IsEnum(WidgetThemeEnum)
  theme: WidgetThemeEnum;

  @IsObject()
  @IsOptional()
  settings: any;
}
