import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('testimonials')
export class TestimonialEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'i_key', type: 'uuid', unique: true })
  iKey: string;

  @Column('text')
  content: string;

  @Column()
  author: string;

  @Column()
  status: string;

  @Column('simple-array')
  tags: string[];

  @Column('int')
  rating: number;

  @Column()
  category: string;

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @Column('text', { name: 'image_url', nullable: true })
  imageUrl: string | null;

  @Column('text', { name: 'video_url', nullable: true })
  videoUrl: string | null;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date | null;
}
