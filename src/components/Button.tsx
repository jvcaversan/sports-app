import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  isFullWidth?: boolean;
  textStyle?: TextStyle;
  buttonStyle?: ViewStyle;
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  textStyle,
  buttonStyle,
  ...rest
}: ButtonProps) {
  function getButtonStyles(): ViewStyle[] {
    const styles: ViewStyle[] = [baseStyles.button];

    // Variantes
    if (variant === "primary") styles.push(baseStyles.primaryButton);
    if (variant === "secondary") styles.push(baseStyles.secondaryButton);
    if (variant === "outline") styles.push(baseStyles.outlineButton);

    // Tamanhos
    if (size === "small") styles.push(baseStyles.smallButton);
    if (size === "large") styles.push(baseStyles.largeButton);

    // Largura total
    if (isFullWidth) styles.push(baseStyles.fullWidth);

    // Desabilitado
    if (disabled) styles.push(baseStyles.disabledButton);

    // Estilo customizado
    if (buttonStyle) styles.push(buttonStyle);

    return styles;
  }

  function getTextStyles(): TextStyle[] {
    const styles: TextStyle[] = [baseStyles.text];

    if (variant === "primary") styles.push(baseStyles.primaryText);
    if (variant === "secondary") styles.push(baseStyles.secondaryText);
    if (variant === "outline") styles.push(baseStyles.outlineText);
    if (disabled) styles.push(baseStyles.disabledText);
    if (textStyle) styles.push(textStyle);

    return styles;
  }

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#007AFF" : "#FFFFFF"}
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const baseStyles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48, // Tamanho médio padrão
  },

  // Variantes
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#5856D6",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },

  // Tamanhos
  smallButton: {
    height: 36,
    paddingHorizontal: 12,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 24,
  },

  // Estados
  disabledButton: {
    backgroundColor: "#E5E5EA",
    borderColor: "#E5E5EA",
  },
  fullWidth: {
    width: "100%",
  },

  // Textos
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#007AFF",
  },
  disabledText: {
    color: "#8E8E93",
  },
});
