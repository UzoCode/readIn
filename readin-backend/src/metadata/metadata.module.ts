// src/metadata/metadata.module.ts
import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Module({
  providers: [MetadataService],
  exports: [MetadataService], // Export the service so other modules can use it
})
export class MetadataModule {}
