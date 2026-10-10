import { IsString, IsEmail, IsNotEmpty, IsOptional, IsArray, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ClientTypeDto {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  RESIDENCE = 'RESIDENCE',
  SUPERMARKET = 'SUPERMARKET',
  CATERING = 'CATERING',
  INSTITUTION = 'INSTITUTION',
  OTHER = 'OTHER'
}

export class OrderItemDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  subtotal: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEnum(ClientTypeDto)
  @IsOptional()
  clientType?: ClientTypeDto;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
