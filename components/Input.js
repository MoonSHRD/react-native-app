import React, { Component } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

import Text from './Text';
import Block from './Block';
import Button from './Button';
import { theme } from '../constants';

export default class Input extends Component {
  state = {
    toggleSecure: false,
  }

  renderLabel() {
    const { label, error, labelStyle } = this.props;
    
    const labelTextStyles = [
      styles.label,
      error && { borderColor: theme.colors.accent },
      labelStyle,
    ];

    if (!label) return null

    return (
      <Block flex={false}>
        {label ? <Text gray2={!error} accent={error} style={labelTextStyles}>{label}</Text> : null}
      </Block>
    )
  }

  renderToggle() {
    const { secure, rightLabel } = this.props;
    const { toggleSecure } = this.state;

    if (!secure) return null;

    return (
      <Button
        style={styles.toggle}
        onPress={() => this.setState({ toggleSecure: !toggleSecure })}
      >
      {
        rightLabel ? rightLabel :
          <Icon
            color={theme.colors.gray}
            size={theme.sizes.font * 2}
            name={!toggleSecure ? "md-eye-off" : "md-eye"}
        />
      }
      </Button>
    );
  }

  renderRight() {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <Button
        style={[styles.toggle, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </Button>
    );
  }

  render() {
    const {
      email,
      phone,
      number,
      secure,
      label,
      error,
      style,
      ...props
    } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;
    const isLabel = label ? this.renderLabel() : null;

    const inputStyles = [
      styles.input,
      error && { borderColor: theme.colors.accent },
      style,
    ];

    const inputType = email
      ? 'email-address' : number
      ? 'numeric' : phone
      ? 'phone-pad' : 'default';

    return (
      <Block flex={false} margin={[theme.sizes.base / 2, 0]}>
        {isLabel}
        <TextInput
          style={inputStyles}
          secureTextEntry={isSecure}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={inputType}
          {...props}
        />
        {this.renderToggle()}
        {this.renderRight()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.black,
    borderRadius: theme.sizes.radius,
    fontSize: theme.sizes.font,
    fontWeight: '500',
    color: theme.colors.black,
    height: theme.sizes.base * 3,
  },
  label: {},
  toggle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    // top: theme.sizes.base,
    backgroundColor: theme.colors.lightGray,
    right: 15,
  }
});