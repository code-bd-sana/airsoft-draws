import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ContactController } from './contact.controller';

@Global()
@Module({
  controllers: [ContactController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
