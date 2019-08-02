import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants';

export default class Button extends Component {
  render() {
    const {
      style,
      opacity,
      gradient,
      color,
      startColor,
      endColor,
      end,
      start,
      locations,
      shadow,
      children,
      ...props
    } = this.props;

    const buttonStyles = [
      styles.button,
      shadow && styles.shadow,
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      style,
    ];

    if (gradient) {
      return (
        <TouchableOpacity
          style={buttonStyles}
          activeOpacity={opacity}
          {...props}
        >
          <LinearGradient
            start={start}
            end={end}
            locations={locations}
            style={buttonStyles}
            colors={[startColor, endColor]}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={opacity || 0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    )
  }
}

Button.defaultProps = {
  startColor: theme.colors.primary,
  endColor: theme.colors.secondary,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: theme.colors.white,
}


const styles = StyleSheet.create({
  button: {
    borderRadius: theme.sizes.radius,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
    marginVertical: theme.sizes.padding / 3,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  black: { backgroundColor: theme.colors.black, },
  notBlack: { backgroundColor: theme.colors.notBlack, },
  lightGray: { backgroundColor: theme.colors.lightGray, },
  gray: { backgroundColor: theme.colors.gray, },
  darkGray: { backgroundColor: theme.colors.darkGrey, },
  white: { backgroundColor: theme.colors.white, },
  lightBlue: { backgroundColor: theme.colors.lightBlue, },
  blue: { backgroundColor: theme.colors.blue, },
  lightSkyBlue: { backgroundColor: theme.colors.lightSkyBlue, },
  red: { backgroundColor: theme.colors.red, },
  pink: { backgroundColor: theme.colors.pink, },
});