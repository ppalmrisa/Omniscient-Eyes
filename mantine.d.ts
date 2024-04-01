import { MantineColorsTuple } from '@mantine/core'

import { otherColors } from './lib/theme'

type ExtendedCustomColors = DefaultMantineColor;
declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
  export interface MantineThemeOther extends otherColors {}
}
