import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { MailService } from './mail.service';

describe('ContactController', () => {
  let controller: ContactController;
  let mockMailService: {
    sendContactFormEmail: jest.Mock;
  };

  beforeEach(async () => {
    mockMailService = {
      sendContactFormEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [{ provide: MailService, useValue: mockMailService }],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendContactMessage', () => {
    it('should delegate to mailService.sendContactFormEmail', async () => {
      const dto = {
        name: 'Alice',
        email: 'alice@example.com',
        message: 'Question about raffle',
      };
      mockMailService.sendContactFormEmail.mockResolvedValue({
        success: true,
        message: 'Sent',
      });

      const result = await controller.sendContactMessage(dto);
      expect(mockMailService.sendContactFormEmail).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ success: true, message: 'Sent' });
    });
  });
});
