import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  testimonialId: string;

  @Column()
  type: string; // 'view' | 'click'

  @CreateDateColumn()
  createdAt: Date;

  @Column('json', { nullable: true })
  metadata?: Record<string, any>;
}
