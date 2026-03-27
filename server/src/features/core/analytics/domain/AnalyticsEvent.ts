export type AnalyticsEventType = 'view' | 'click';

export interface AnalyticsEventProps {
  id: string;
  organizationId: string;
  testimonialId: string;
  type: AnalyticsEventType;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export class AnalyticsEvent {
  id: string;
  organizationId: string;
  testimonialId: string;
  type: AnalyticsEventType;
  createdAt: Date;
  metadata?: Record<string, any>;

  constructor(props: AnalyticsEventProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.testimonialId = props.testimonialId;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata;
  }
}
