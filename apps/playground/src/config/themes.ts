export type ThemeType = 'dark' | 'light'
export type AccentColor = 'purple' | 'blue' | 'green' | 'orange'
export type RadiusSize = 'none' | 'small' | 'medium' | 'large'

export interface ThemeConfig {
  type: ThemeType
  accent: AccentColor
  radius: RadiusSize
}

export const accentColors: Record<AccentColor, { primary: string; secondary: string }> = {
  purple: {
    primary: '262 83% 58%', // hsl values for CSS variables
    secondary: '263 70% 50%',
  },
  blue: {
    primary: '221 83% 53%',
    secondary: '221 70% 45%',
  },
  green: {
    primary: '142 76% 36%',
    secondary: '142 70% 30%',
  },
  orange: {
    primary: '25 95% 53%',
    secondary: '25 85% 45%',
  },
}

export const radiusSizes: Record<RadiusSize, string> = {
  none: '0px',
  small: '0.375rem',
  medium: '0.5rem',
  large: '1rem',
}

export const defaultTheme: ThemeConfig = {
  type: 'dark',
  accent: 'purple',
  radius: 'medium',
}
