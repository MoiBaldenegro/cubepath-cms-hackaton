export enum WidgetTypeEnum {
  CAROUSEL = 'CAROUSEL',
  GRID = 'GRID',
  POPOVER = 'POPOVER',
  WALL = 'WALL',
}

export class WidgetType {
  constructor(readonly value: WidgetTypeEnum) {
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: WidgetTypeEnum): void {
    if (!Object.values(WidgetTypeEnum).includes(value)) {
      throw new Error('Invalid WidgetType');
    }
  }
}
