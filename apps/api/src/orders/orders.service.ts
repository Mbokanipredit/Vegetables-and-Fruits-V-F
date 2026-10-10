import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const orderNumber = `VF-ORD-${Date.now().toString().slice(-6)}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        companyName: createOrderDto.companyName,
        clientType: (createOrderDto.clientType as any) || 'HOTEL',
        contactPerson: createOrderDto.contactPerson,
        email: createOrderDto.email,
        phone: createOrderDto.phone,
        address: createOrderDto.address,
        deliveryDate: createOrderDto.deliveryDate,
        notes: createOrderDto.notes,
        totalAmount: createOrderDto.totalAmount,
        status: 'PENDING',
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId || null,
            productName: item.productName,
            unit: item.unit,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async updateStatus(id: string, status: any) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}
