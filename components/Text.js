import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";

import { theme } from "../constants";

export default class Typography extends Component {
  render() {
    const {
      h1,
      h2,
      h3,
      h4,
      headline,
      body,
      callout,
      subhead,
      footnote,
      caption,
      caption2,  
      size,
      transform,
      align,
      // styling
      regular,
      bold,
      semibold,
      medium,
      weight,
      light,
      center,
      right,
      spacing, // letter-spacing
      height, // line-height
      // colors
      color,
      black,
      notBlack,
      lightGray,
      gray,
      darkGray,
      white,
      lightBlue,
      blue,
      lightSkyBlue,
      red,
      pink,
      style,
      children,
      ...props
    } = this.props;

    const textStyles = [
      styles.text,
      h1 && styles.h1,
      h2 && styles.h2,
      h3 && styles.h3,
      h4 && styles.h4,
      headline && styles.headline,
      body && styles.body,
      callout && styles.callout,
      subhead && styles.subhead,
      footnote && styles.footnote,
      caption && styles.caption,
      caption2 && styles.caption2,  
      size && { fontSize: size },
      transform && { textTransform: transform },
      align && { textAlign: align },
      height && { lineHeight: height },
      spacing && { letterSpacing: spacing },
      weight && { fontWeight: weight },
      regular && styles.regular,
      bold && styles.bold,
      semibold && styles.semibold,
      medium && styles.medium,
      light && styles.light,
      center && styles.center,
      right && styles.right,
      color && styles[color],
      color && !styles[color] && { color },
      // color shortcuts
      black && styles.black,
      notBlack && styles.notBlack,
      lightGray && styles.lightGray,
      gray && styles.gray,
      darkGray && styles.darkGray,
      white && styles.white,
      lightBlue && styles.lightBlue,
      blue && styles.blue,
      lightSkyBlue && styles.lightSkyBlue,
      red && styles.red,
      pink && styles.pink,
      style // rewrite predefined styles
    ];

    return (
      <Text style={textStyles} {...props}>
        {children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  // default style
  text: {
    fontSize: theme.sizes.font,
    color: theme.colors.black
  },
  // variations
  regular: {
    fontWeight: "normal",
  },
  bold: {
    fontWeight: "bold",
  },
  semibold: {
    fontWeight: "600",
  },
  medium: {
    fontWeight: "500",
  },
  light: {
    fontWeight: "200",
  },
  // position
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  // colors
  black: { color: theme.colors.black },
  notBlack: { color: theme.colors.notBlack },
  lightGray: { color: theme.colors.lightGray },
  gray: { color: theme.colors.gray },
  darkGray: { color: theme.colors.darkGray },
  white: { color: theme.colors.white },
  lightBlue: { color: theme.colors.lightBlue },
  blue: { color: theme.colors.blue },
  lightSkyBlue: { color: theme.colors.lightSkyBlue },
  red: { color: theme.colors.red },
  pink: { color: theme.colors.pink },
  // fonts
  h1: theme.fonts.h1,
  h2: theme.fonts.h2,
  h3: theme.fonts.h3,
  h4: theme.fonts.h4,
  headline: theme.fonts.headline,
  body: theme.fonts.body,
  callout: theme.fonts.callout,
  subhead: theme.fonts.subhead,
  footnote: theme.fonts.footnote,
  caption: theme.fonts.caption,
  caption2: theme.fonts.caption2,  
});
