import 'nativewind';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TouchableHighlightProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
  }
  interface SectionListProps<ItemT, SectionT> {
    className?: string;
  }
}

declare module '@expo/html-elements' {
  interface H1Props {
    className?: string;
  }
  interface H2Props {
    className?: string;
  }
  interface H3Props {
    className?: string;
  }
  interface H4Props {
    className?: string;
  }
  interface H5Props {
    className?: string;
  }
  interface H6Props {
    className?: string;
  }
}
