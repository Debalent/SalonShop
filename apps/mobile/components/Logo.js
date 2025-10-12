import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ size = 'medium', style = {}, ...props }) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40 };
      case 'medium':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 120, height: 120 };
      case 'xlarge':
        return { width: 160, height: 160 };
      default:
        return { width: 80, height: 80 };
    }
  };

  const styles = StyleSheet.create({
    logo: {
      resizeMode: 'contain',
      ...getSizeStyle(),
    },
  });

  return (
    <Image
      source={require('../assets/logo.png')}
      style={[styles.logo, style]}
      {...props}
    />
  );
};

export default Logo;