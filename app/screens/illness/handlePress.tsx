//import navigateTo from '../../navigation/navigateTo';
import {PressProps} from '../../typings/global';
import {PressType} from './constants';

const handlePress = ({action, data}: PressProps) => {
  if (!action) {
    return;
  }
  const {navigation, path, extraData} = data || {};
  switch (action) {
    case PressType.NAVIGATE:
    default:
      if (navigation && path) {
        // navigateTo({
        //   navigation,
        //   path,
        //   params: extraData || {},
        // });
      }
      break;
  }
};

export default handlePress;
