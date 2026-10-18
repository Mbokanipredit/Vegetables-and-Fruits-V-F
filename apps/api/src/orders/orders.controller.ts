import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard, AdminGuard } from '../auth/auth.guard';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Customers must be logged in so the admin knows who ordered
  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  // Logged-in customer's own orders
  @Get('mine')
  @UseGuards(AuthGuard)
  async getMyOrders(@Req() req: any) {
    return this.ordersService.findByUser(req.user.sub);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllOrders() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
