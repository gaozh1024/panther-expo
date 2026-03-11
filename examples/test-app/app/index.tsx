import { useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  Heading,
  HStack,
  ScrollView,
  Text,
  VStack,
  Divider,
} from '@panther-expo/ui';
import { TestCore } from '@/components/TestCore';
import { TestTheme } from '@/components/TestTheme';
import { TestUtils } from '@/components/TestUtils';
import { TestUI } from '@/components/TestUI';

type TestTab = 'ui' | 'core' | 'theme' | 'utils';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TestTab>('ui');

  const tabs: { id: TestTab; label: string }[] = [
    { id: 'ui', label: 'UI 组件' },
    { id: 'core', label: 'Core 功能' },
    { id: 'theme', label: 'Theme 主题' },
    { id: 'utils', label: 'Utils 工具' },
  ];

  return (
    <Box className="flex-1 bg-background-50">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack space="md">
          {/* 标题 */}
          <Center className="py-4">
            <Heading size="2xl" className="text-typography-900">
              🐆 Panther Expo
            </Heading>
            <Text className="text-typography-500 mt-2">
              框架功能测试应用
            </Text>
          </Center>

          {/* Tab 切换 */}
          <HStack space="sm" className="flex-wrap justify-center">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                size="sm"
                variant={activeTab === tab.id ? 'solid' : 'outline'}
                action={activeTab === tab.id ? 'primary' : 'secondary'}
                onPress={() => setActiveTab(tab.id)}
              >
                <ButtonText>{tab.label}</ButtonText>
              </Button>
            ))}
          </HStack>

          <Divider />

          {/* 测试内容 */}
          {activeTab === 'ui' && <TestUI />}
          {activeTab === 'core' && <TestCore />}
          {activeTab === 'theme' && <TestTheme />}
          {activeTab === 'utils' && <TestUtils />}
        </VStack>
      </ScrollView>
    </Box>
  );
}
