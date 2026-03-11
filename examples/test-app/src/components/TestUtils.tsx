import { useState } from 'react';
import { z } from 'zod';
import {
  Card,
  VStack,
  Text,
  Button,
  ButtonText,
  Input,
  InputField,
  HStack,
  Badge,
  BadgeText,
} from '@panther-expo/ui';
import { getValidationErrors, hasErrors, getFieldError, hexToRgb, rgbaToRgb } from '@panther-expo/utils';

// 定义测试验证模式
const testSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  age: z.number().min(18, '年龄必须大于18岁'),
});

export function TestUtils() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [colorInput, setColorInput] = useState('#f38b32');
  const [colorResult, setColorResult] = useState('');

  // 测试表单验证
  const testValidation = () => {
    try {
      testSchema.parse({ email, password, age: 20 });
      setErrors({});
      alert('验证通过！');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = getValidationErrors(error);
        setErrors(fieldErrors);
        console.log('验证错误:', fieldErrors);
      }
    }
  };

  // 测试颜色转换
  const testHexToRgb = () => {
    try {
      const result = hexToRgb(colorInput);
      setColorResult(`RGB: ${result}`);
    } catch (error) {
      setColorResult('转换失败: 无效的十六进制颜色');
    }
  };

  const testRgbaToRgb = () => {
    try {
      const result = rgbaToRgb('rgba(243, 139, 50, 0.5)');
      setColorResult(`RGB: ${result}`);
    } catch (error) {
      setColorResult('转换失败');
    }
  };

  return (
    <VStack space="md">
      <Card className="p-4">
        <Text className="font-bold text-lg mb-4">🛠️ Utils 工具测试</Text>

        {/* 表单验证测试 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            表单验证 (Zod)
          </Text>
          <Input>
            <InputField
              placeholder="邮箱"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
          {getFieldError(errors, 'email') && (
            <Text className="text-xs text-error-500">
              {getFieldError(errors, 'email')}
            </Text>
          )}

          <Input>
            <InputField
              placeholder="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Input>
          {getFieldError(errors, 'password') && (
            <Text className="text-xs text-error-500">
              {getFieldError(errors, 'password')}
            </Text>
          )}

          <Button onPress={testValidation}>
            <ButtonText>验证表单</ButtonText>
          </Button>

          {hasErrors(errors) && (
            <Badge action="error">
              <BadgeText>表单有错误，请检查</BadgeText>
            </Badge>
          )}
        </VStack>

        {/* 颜色工具测试 */}
        <VStack space="sm">
          <Text className="text-sm font-semibold text-typography-700">
            颜色转换工具
          </Text>
          <Input>
            <InputField
              placeholder="输入十六进制颜色，如 #f38b32"
              value={colorInput}
              onChangeText={setColorInput}
            />
          </Input>
          <HStack space="sm">
            <Button size="sm" onPress={testHexToRgb}>
              <ButtonText>Hex 转 RGB</ButtonText>
            </Button>
            <Button size="sm" variant="outline" onPress={testRgbaToRgb}>
              <ButtonText>RGBA 转 RGB</ButtonText>
            </Button>
          </HStack>
          {colorResult && (
            <Text className="text-sm text-typography-700">
              结果: {colorResult}
            </Text>
          )}
        </VStack>
      </Card>
    </VStack>
  );
}
