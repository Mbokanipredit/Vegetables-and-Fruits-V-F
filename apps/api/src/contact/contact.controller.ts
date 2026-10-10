import { Controller, Post, Get, Body } from '@nestjs/common';
import { ContactService, CreateContactDto } from './contact.service';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createMessage(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @Get()
  async getAllMessages() {
    return this.contactService.findAll();
  }
}
