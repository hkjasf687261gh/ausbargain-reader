import { CardSettingsInterface } from '../contexts/CardSettingsContext';

export function getHighlightColour(color: CardSettingsInterface["highlightColor"]): string | null {
  switch (color) {
    case 'blue':
      return "--ion-color-secondary"  
    case 'green':
      return "--ion-color-success"  
    case 'yellow':
      return "--ion-color-warning"  
    case 'red':
      return "--ion-color-danger"  
    // case 'green':
    //   return "--ion-color-dark"  
    // case 'green':
    //   return "--ion-color-medium"  
    // case 'green':
    //   return "--ion-color-light"  
    // case 'green':
    //   return "--ion-color-secondary"  
    // case 'green':
    //   return "--ion-color-tertiary"  
    default:
      return null;
  }
}









