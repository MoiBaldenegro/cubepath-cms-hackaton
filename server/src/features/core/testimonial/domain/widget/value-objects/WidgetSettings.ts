export interface WidgetSettingsProps {
  maxItems?: number;
  showRating?: boolean;
  showDate?: boolean;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export class WidgetSettings {
  constructor(readonly value: WidgetSettingsProps) {}
}
