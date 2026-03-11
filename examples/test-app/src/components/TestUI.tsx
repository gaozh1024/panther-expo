import { useState } from 'react';
import {
  Card,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  Switch,
  Badge,
  BadgeText,
  Spinner,
  Alert,
  AlertText,
  AlertIcon,
  Center,
} from '@panther-expo/ui';
import { Check, AlertCircle } from 'lucide-react-native';

export function TestUI() {
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <VStack space="md">
      <Card className="p-4">
        <Text className="font-bold text-lg mb-4">🎨 UI 组件测试</Text>

        {/* Button 测试 */}
        <VStack space="sm" className="mb-4">
          <Text className="text-sm text-typography-500">Button 按钮</Text>
          <HStack space="sm">
            <Button action="primary" onPress={() => {}}>
              <ButtonText>主要</ButtonText>
            </Button>
            <Button action="secondary" onPress={() => {}}>
              <ButtonText>次要</ButtonText>
            </Button>
            <Button variant="outline" onPress={() => {}}>
              <ButtonText>边框</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {/* Input 测试 */}
        <VStack space="sm" className="mb-4">
          <Text className="text-sm text-typography-500">Input 输入框</Text>
          <Input>
            <InputField
              placeholder="请输入内容..."
              value={inputValue}
              onChangeText={setInputValue}
            />
          </Input>
          <Text className="text-xs text-typography-400">
            输入值: {inputValue || '(空)'}
          </Text>
        </VStack>

        {/* Checkbox & Switch */}
        <HStack space="md" className="mb-4">
          <VStack space="sm">
            <Text className="text-sm text-typography-500">Checkbox</Text>
            <Checkbox value="test" isChecked={checked} onChange={setChecked}>
              <CheckboxIndicator>
                <CheckIcon as={Check} />
              </CheckboxIndicator>
              <CheckboxLabel>选项</CheckboxLabel>
            </Checkbox>
          </VStack>

          <VStack space="sm">
            <Text className="text-sm text-typography-500">Switch</Text>
            <Switch value={switchOn} onValueChange={setSwitchOn} />
          </VStack>
        </HStack>

        {/* Badge */}
        <VStack space="sm" className="mb-4">
          <Text className="text-sm text-typography-500">Badge 标签</Text>
          <HStack space="sm">
            <Badge action="success">
              <BadgeText>成功</BadgeText>
            </Badge>
            <Badge action="error">
              <BadgeText>错误</BadgeText>
            </Badge>
            <Badge action="warning">
              <BadgeText>警告</BadgeText>
            </Badge>
            <Badge action="info">
              <BadgeText>信息</BadgeText>
            </Badge>
          </HStack>
        </VStack>

        {/* Alert */}
        <VStack space="sm" className="mb-4">
          <Text className="text-sm text-typography-500">Alert 提示</Text>
          <Alert action="success">
            <AlertIcon as={AlertCircle} />
            <AlertText>这是一个成功提示！</AlertText>
          </Alert>
        </VStack>

        {/* Spinner */}
        <VStack space="sm">
          <Text className="text-sm text-typography-500">Spinner 加载</Text>
          <HStack space="md" className="items-center">
            <Button onPress={handleLoadingTest} isDisabled={loading}>
              <ButtonText>{loading ? '加载中...' : '点击加载'}</ButtonText>
            </Button>
            {loading && <Spinner />}
          </HStack>
        </VStack>
      </Card>
    </VStack>
  );
}
