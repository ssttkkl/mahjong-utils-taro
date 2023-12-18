import PropTypes from 'prop-types';
import { View } from '@tarojs/components';

const Spacer = ({horizontal, size}) => {
  const defaultValue = 'auto';

  return (
    <View
      style={{
        width: horizontal ? size : defaultValue,
        height: !horizontal ? size : defaultValue,
      }}
    />
  );
};

Spacer.propTypes = {
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  horizontal: PropTypes.bool,
};

Spacer.defaultProps = {
  horizontal: false,
};

export default Spacer;