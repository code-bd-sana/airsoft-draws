import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactFormDto } from './dto/contact-form.dto';
import { MailService } from './mail.service';

@ApiTags('Contact')
@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact form message (Dispatches email to Admin via SMTP)' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  async sendContactMessage(@Body() dto: ContactFormDto) {
    return this.mailService.sendContactFormEmail(dto);
  }
}
