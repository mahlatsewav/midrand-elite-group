import { clsx } from "clsx"
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { twMerge } from "tailwind-merge"

interface ButtonProps {
    title: string
    onPress?: () => void
    varient?: "primary" | "success" | "danger" | "outline"
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string
}

const Button = ({ title, onPress, varient = "primary", size = "md", disabled = false, className }: ButtonProps) => {
    const variantStyles = {
        primary: "bg-brand-blue text-white", 
        success: "bg-brand-green text-white",
        danger: "bg-red-600 text-white",
        outline: "border border-brand-blue text-brand-blue bg-transparent"
    }

    const sizeStyles = {
        sm: "px-3 py-1.5 h-8 text-xs", 
        md: "px-4 py-2 h-10 text-sm",
        lg: "px-6 py-2 h-12 text-base"
    }

    const disabledStyles = disabled
        ? "opacity-50"
        : "active:opacity-80"

  return (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={twMerge(
            clsx(
                "rounded-lg justify-center items-center",
                variantStyles[varient],
                sizeStyles[size],
                disabledStyles,
                className
              )
          )}
        >
          <Text
              className={clsx(
                  "font-semibold",
                  varient === "outline" ? "text-brand-blue" : "text-white"
              )}
          >
              {title}
          </Text>
    </TouchableOpacity>
  )
}

export default Button