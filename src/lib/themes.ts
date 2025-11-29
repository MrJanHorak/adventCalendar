export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  backgroundColor: string;
  backgroundPattern: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  snowflakesEnabled: boolean;
  buttonStyle?: 'gradient' | 'solid' | 'outline';
  buttonPrimaryColor?: string;
  buttonSecondaryColor?: string;
}

export const themePresets: ThemePreset[] = [
  {
    id: 'classic',
    name: 'Classic Christmas',
    description: 'Traditional red and green holiday theme',
    backgroundColor: '#f9fafb',
    backgroundPattern: 'none',
    primaryColor: '#dc2626',
    secondaryColor: '#16a34a',
    textColor: '#111827',
    snowflakesEnabled: true,
    buttonStyle: 'gradient',
    buttonPrimaryColor: '#dc2626',
    buttonSecondaryColor: '#16a34a',
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    description: 'Icy blues and whites for a snowy feel',
    backgroundColor: '#eff6ff',
    backgroundPattern: 'snowflakes',
    primaryColor: '#3b82f6',
    secondaryColor: '#60a5fa',
    textColor: '#1e3a8a',
    snowflakesEnabled: true,
    buttonStyle: 'gradient',
    buttonPrimaryColor: '#3b82f6',
    buttonSecondaryColor: '#60a5fa',
  },
  {
    id: 'festive-gold',
    name: 'Festive Gold',
    description: 'Elegant gold and deep green luxury theme',
    backgroundColor: '#fffbeb',
    backgroundPattern: 'stars',
    primaryColor: '#eab308',
    secondaryColor: '#15803d',
    textColor: '#713f12',
    snowflakesEnabled: false,
    buttonStyle: 'solid',
    buttonPrimaryColor: '#eab308',
    buttonSecondaryColor: '#15803d',
  },
  {
    id: 'cozy-cabin',
    name: 'Cozy Cabin',
    description: 'Warm browns and rustic reds',
    backgroundColor: '#fef3c7',
    backgroundPattern: 'woodgrain',
    primaryColor: '#b91c1c',
    secondaryColor: '#92400e',
    textColor: '#451a03',
    snowflakesEnabled: false,
    buttonStyle: 'solid',
    buttonPrimaryColor: '#b91c1c',
    buttonSecondaryColor: '#92400e',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and contemporary holiday design',
    backgroundColor: '#ffffff',
    backgroundPattern: 'dots',
    primaryColor: '#0f172a',
    secondaryColor: '#475569',
    textColor: '#1e293b',
    snowflakesEnabled: false,
    buttonStyle: 'outline',
    buttonPrimaryColor: '#0f172a',
    buttonSecondaryColor: '#475569',
  },
  {
    id: 'candy-cane',
    name: 'Candy Cane',
    description: 'Sweet peppermint pink and white stripes',
    backgroundColor: '#fff1f2',
    backgroundPattern: 'stripes',
    primaryColor: '#f43f5e',
    secondaryColor: '#fb7185',
    textColor: '#881337',
    snowflakesEnabled: true,
    buttonStyle: 'gradient',
    buttonPrimaryColor: '#f43f5e',
    buttonSecondaryColor: '#fb7185',
  },
];

export function getThemePreset(themeId: string): ThemePreset | undefined {
  return themePresets.find((theme) => theme.id === themeId);
}

export function getThemeStyles(theme: ThemePreset | null) {
  if (!theme) return {};

  const baseStyles: Record<string, string> = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
  };

  // Add background pattern styles
  if (theme.backgroundPattern && theme.backgroundPattern !== 'none') {
    switch (theme.backgroundPattern) {
      case 'snowflakes':
        baseStyles.backgroundImage =
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='30' font-size='20' fill='%23cbd5e1' opacity='0.4'%3E❄%3C/text%3E%3Ctext x='60' y='70' font-size='16' fill='%23cbd5e1' opacity='0.3'%3E❅%3C/text%3E%3Ctext x='80' y='20' font-size='14' fill='%23cbd5e1' opacity='0.35'%3E❆%3C/text%3E%3C/svg%3E\")";
        break;
      case 'stars':
        baseStyles.backgroundImage =
          "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='15' y='35' font-size='18' fill='%23fbbf24' opacity='0.4'%3E⭐%3C/text%3E%3Ctext x='65' y='75' font-size='14' fill='%23fbbf24' opacity='0.35'%3E✨%3C/text%3E%3Ctext x='85' y='25' font-size='12' fill='%23fbbf24' opacity='0.3'%3E⭐%3C/text%3E%3Ctext x='40' y='55' font-size='10' fill='%23fbbf24' opacity='0.25'%3E✨%3C/text%3E%3C/svg%3E\")";
        break;
      case 'woodgrain':
        baseStyles.backgroundImage =
          'linear-gradient(90deg, rgba(92,77,66,0.05) 25%, transparent 25%, transparent 50%, rgba(92,77,66,0.05) 50%, rgba(92,77,66,0.05) 75%, transparent 75%, transparent)';
        baseStyles.backgroundSize = '40px 40px';
        break;
      case 'dots':
        baseStyles.backgroundImage =
          'radial-gradient(circle, rgba(15,23,42,0.1) 1px, transparent 1px)';
        baseStyles.backgroundSize = '20px 20px';
        break;
      case 'stripes':
        baseStyles.backgroundImage = `linear-gradient(45deg, ${theme.primaryColor}15 25%, transparent 25%, transparent 50%, ${theme.primaryColor}15 50%, ${theme.primaryColor}15 75%, transparent 75%, transparent)`;
        baseStyles.backgroundSize = '40px 40px';
        break;
    }
  }

  return baseStyles;
}

export function getButtonStyles(
  buttonStyle: string | null | undefined,
  primaryColor: string,
  secondaryColor: string
): React.CSSProperties {
  const style = buttonStyle || 'gradient';

  switch (style) {
    case 'gradient':
      return {
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        color: '#ffffff',
        border: 'none',
      };
    case 'solid':
      return {
        backgroundColor: primaryColor,
        color: '#ffffff',
        border: 'none',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: primaryColor,
        border: `2px solid ${primaryColor}`,
      };
    default:
      return {
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
        color: '#ffffff',
        border: 'none',
      };
  }
}
