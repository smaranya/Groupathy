//import navigateTo from '../../navigation/navigateTo';
import {PressProps} from '../../typings/global';

export enum PressType {
  NAVIGATE = 'NAVIGATE',
  REPLACE = 'REPLACE',
}

const handlePress = ({action, data}: PressProps) => {
  if (!action) {
    return;
  }
  const {navigation, path, extraData} = data || {};
  switch (action) {
    case PressType.REPLACE:
      if (navigation && path) {
        // navigateTo({
        //   navigation,
        //   path,
        //   params: extraData || {},
        //   replace: true,
        // });
      }
      break;
    case PressType.NAVIGATE:
    default:
      if (navigation && path) {
        // navigateTo({
        //   navigation,
        //   path,
        //   params: extraData || {},
        //   replace: false,
        // });
      }
      break;
  }
};

export default handlePress;
