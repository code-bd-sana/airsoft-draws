import { PartialType } from '@nestjs/swagger';
import { CreateTestAwDto } from './create-test-aw.dto';

export class UpdateTestAwDto extends PartialType(CreateTestAwDto) {}
