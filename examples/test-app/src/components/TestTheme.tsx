import { useState } from 'react';
import {
  Card,
  VStack,
  Text,
  Button,
  ButtonText,
  HStack,
  Center,
  Box,
} from '@panther-expo/ui';
import { useTheme } from '@panther-expo/theme';
import { generateColorPalette, generateColorPalettes } from '@panther-expo/theme/palette';

export function TestTheme() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [palette, setPalette] = useState<ReturnType<typeof generateColorPalette> | null>(null);

  // 测试调色板生成
  const testGeneratePalette = () => {
    const p = generateColorPalette('#f38b32');
    setPalette(p);
    console.log('生成的调色板:', p);
  };

  const testGeneratePalettes = () => {
    const palettes = generateColorPalettes({
      primary: '#f38b32',
      secondary: '#4A5568',
      success: '#52C41A',
      error: '#FF4D4F',
    });
    console.log('多个调色板:', palettes);
    alert('已生成多个调色板，请查看控制台');
  };

  return (
    <VStack space="md">
      <Card className="p-4">
        <Text className="font-bold text-lg mb-4">🎨 Theme 主题测试</Text>

        {/* 当前主题信息 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            当前主题状态
          </Text>
          <HStack space="sm" className="items-center">
            <Text className="text-sm text-typography-500">
              当前模式: {isDark ? '🌙 暗色' : '☀️ 亮色'}
            </Text>
          </HStack>
          <Button onPress={toggleTheme}>
            <ButtonText>切换主题</ButtonText>
          </Button>
        </VStack>

        {/* 颜色变量 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            主题颜色变量
          </Text>
          <HStack space="sm">
            <Center className="w-16 h-16 rounded-lg" style={{ backgroundColor: colors.primary }}>
              <Text className="text-white text-xs">主色</Text>
            </Center>
            <Center className="w-16 h-16 rounded-lg bg-background-200">
              <Text className="text-xs">背景</Text>
            </Center>
            <Center className="w-16 h-16 rounded-lg bg-typography-700">
              <Text className="text-white text-xs">文本</Text>
            </Center>
          </HStack>
        </VStack>

        {/* 调色板生成 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            调色板生成工具
          </Text>
          <HStack space="sm">
            <Button size="sm" onPress={testGeneratePalette}>
              <ButtonText>生成单个调色板</ButtonText>
            </Button>
            <Button size="sm" variant="outline" onPress={testGeneratePalettes}>
              <ButtonText>生成多个</ButtonText>
            </Button>
          </HStack>
          {palette && (
            <VStack space="xs">
              <Text className="text-xs text-typography-500">生成的色阶:</Text>
              <HStack space="xs" className="flex-wrap">
                {Object.entries(palette).slice(0, 6).map(([key, value]) => (
                  <Center
                    key={key}
                    className="w-10 h-10 rounded"
                    style={{ backgroundColor: `rgb(${value})` }}
                  >
                    <Text className="text-xs text-white">{key}</Text>
                  </Center>
                ))}
              </HStack>
            </VStack>
          )}
        </VStack>

        {/* 间距系统 */}
        <VStack space="sm">
          <Text className="text-sm font-semibold text-typography-700">
            间距系统
          </Text>
          <VStack space="xs">
            {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
              <HStack key={size} space="sm" className="items-center">
                <Box className={`bg-primary-500 rounded`} style={{ width: 20, height: 20 }} />
                <Text className="text-xs text-typography-500">spacing.{size}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card>
    </VStack>
  );
}
