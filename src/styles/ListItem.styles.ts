import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(208, 225, 251, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 14,
    color: '#191c1e',
  },
  destructiveText: {
    color: '#ba1a1a',
    fontWeight: '500',
  },
  listItemRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(194, 198, 214, 0.3)',
    marginHorizontal: 16,
  },
});
