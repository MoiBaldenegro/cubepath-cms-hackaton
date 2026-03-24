export enum WidgetThemeEnum {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  CUSTOM = 'CUSTOM',
}

export class WidgetTheme {
  constructor(readonly value: WidgetThemeEnum) {
    this.ensureIsValid(value);
  }

  private ensureIsValid(value: WidgetThemeEnum): void {
    if (!Object.values(WidgetThemeEnum).includes(value)) {
      throw new Error('Invalid WidgetTheme');
    }
  }
}
