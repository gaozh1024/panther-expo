import { useState, useEffect } from 'react';
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
import { BaseAPI, createSecureStorage } from '@panther-expo/core';
import { logger } from '@panther-expo/core/logger';

// 创建测试存储
const testStorage = createSecureStorage({
  TEST_KEY: 'test_key',
  USER_DATA: 'user_data',
});

export function TestCore() {
  const [storageValue, setStorageValue] = useState('');
  const [storedData, setStoredData] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // 测试存储功能
  const testStorageSave = async () => {
    try {
      await testStorage.setString('TEST_KEY', storageValue);
      logger.info('Storage', '数据已保存', { value: storageValue });
      alert('保存成功！');
    } catch (error) {
      logger.error('Storage', '保存失败', error);
      alert('保存失败！');
    }
  };

  const testStorageRead = async () => {
    try {
      const value = await testStorage.getString('TEST_KEY');
      setStoredData(value);
      logger.info('Storage', '数据已读取', { value });
    } catch (error) {
      logger.error('Storage', '读取失败', error);
    }
  };

  const testStorageClear = async () => {
    try {
      await testStorage.clearAll();
      setStoredData(null);
      setStorageValue('');
      logger.info('Storage', '存储已清除');
      alert('清除成功！');
    } catch (error) {
      logger.error('Storage', '清除失败', error);
    }
  };

  // 测试 API 功能
  const testAPI = async () => {
    setApiStatus('loading');
    logger.info('API', '开始测试 API');

    try {
      // 模拟 API 测试
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setApiStatus('success');
      logger.info('API', 'API 测试成功');
    } catch (error) {
      setApiStatus('error');
      logger.error('API', 'API 测试失败', error);
    }
  };

  // 测试日志功能
  const testLogger = () => {
    logger.debug('Test', '这是一条 debug 日志');
    logger.info('Test', '这是一条 info 日志');
    logger.warn('Test', '这是一条 warn 日志');
    logger.error('Test', '这是一条 error 日志');
    alert('日志已输出到控制台');
  };

  return (
    <VStack space="md">
      <Card className="p-4">
        <Text className="font-bold text-lg mb-4">⚙️ Core 功能测试</Text>

        {/* Storage 测试 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            Secure Storage 安全存储
          </Text>
          <Input>
            <InputField
              placeholder="输入要存储的数据"
              value={storageValue}
              onChangeText={setStorageValue}
            />
          </Input>
          <HStack space="sm">
            <Button size="sm" onPress={testStorageSave}>
              <ButtonText>保存</ButtonText>
            </Button>
            <Button size="sm" variant="outline" onPress={testStorageRead}>
              <ButtonText>读取</ButtonText>
            </Button>
            <Button size="sm" action="negative" variant="outline" onPress={testStorageClear}>
              <ButtonText>清除</ButtonText>
            </Button>
          </HStack>
          {storedData && (
            <Text className="text-sm text-typography-500">
              存储的数据: {storedData}
            </Text>
          )}
        </VStack>

        {/* API 测试 */}
        <VStack space="sm" className="mb-6">
          <Text className="text-sm font-semibold text-typography-700">
            BaseAPI HTTP 客户端
          </Text>
          <Button
            onPress={testAPI}
            isDisabled={apiStatus === 'loading'}
          >
            <ButtonText>
              {apiStatus === 'loading' ? '测试中...' : '测试 API'}
            </ButtonText>
          </Button>
          {apiStatus === 'success' && (
            <Badge action="success">
              <BadgeText>API 测试通过</BadgeText>
            </Badge>
          )}
          {apiStatus === 'error' && (
            <Badge action="error">
              <BadgeText>API 测试失败</BadgeText>
            </Badge>
          )}
        </VStack>

        {/* Logger 测试 */}
        <VStack space="sm">
          <Text className="text-sm font-semibold text-typography-700">
            Logger 日志管理
          </Text>
          <Button variant="outline" onPress={testLogger}>
            <ButtonText>测试日志输出</ButtonText>
          </Button>
        </VStack>
      </Card>
    </VStack>
  );
}
