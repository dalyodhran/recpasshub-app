import { useTheme } from '../use-theme';
import { useColorScheme } from '../use-color-scheme';
import { Colors } from '../../constants/theme';

jest.mock('../use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useTheme', () => {
  const mockUseColorScheme = useColorScheme as jest.Mock;

  test('returns light theme colors when color scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');
    const theme = useTheme();
    expect(theme).toEqual(Colors.light);
  });

  test('returns dark theme colors when color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const theme = useTheme();
    expect(theme).toEqual(Colors.dark);
  });

  test('defaults to light theme colors when color scheme is unspecified', () => {
    mockUseColorScheme.mockReturnValue('unspecified');
    const theme = useTheme();
    expect(theme).toEqual(Colors.light);
  });
});
