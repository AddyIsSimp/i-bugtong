// components/Separator.tsx (recommended)
import React from 'react';
import { View, ViewProps, DimensionValue } from 'react-native';

interface SeparatorProps extends ViewProps {
    orientation?: 'horizontal' | 'vertical';
    color?: string;
    thickness?: number;
    length?: DimensionValue; // Use DimensionValue for width/height
    margin?: number;
}

export const Separator: React.FC<SeparatorProps> = ({
    orientation = 'horizontal',
    color = '#d1d5db',
    thickness = 1,
    length = '100%',
    margin = 0,
    className = '',
    style,
    ...props
}) => {
    const isHorizontal = orientation === 'horizontal';

    return (
        <View
            style={[
                {
                    backgroundColor: color,
                    width: (isHorizontal ? length : thickness) as DimensionValue,
                    height: (isHorizontal ? thickness : length) as DimensionValue,
                    marginTop: isHorizontal ? margin : 0,
                    marginBottom: isHorizontal ? margin : 0,
                    marginLeft: !isHorizontal ? margin : 0,
                    marginRight: !isHorizontal ? margin : 0,
                },
                style,
            ]}
            className={className}
            {...props}
        />
    );
};