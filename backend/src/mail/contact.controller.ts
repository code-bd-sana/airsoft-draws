import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactFormDto } from './dto/contact-form.dto';
import { MailService } from './mail.service';

@ApiTags('Contact')
@Controller('api/v1/contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit a contact form message (Dispatches email to Admin via SMTP)',
    description: 'Receives user inquiries and forwards the formatted message to the platform administration team via SMTP.',
  })
  @ApiResponse({
    status: 200,
    description: 'Message received and processed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Your message has been sent successfully! Our support team will get back to you shortly.',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email format or missing required fields' })
  async sendContactMessage(@Body() dto: ContactFormDto) {
    return this.mailService.sendContactFormEmail(dto);
  }
}

