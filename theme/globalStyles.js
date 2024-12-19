// globalStyles.js
import { StyleSheet } from "react-native";
import COLORS from "./colors";
import FONTS from "./fonts";

const GLOBAL_STYLES = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  textBase: {
    fontSize: FONTS.sizes.regular,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textDefault,
    fontFamily: FONTS.families.primary,
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  brandingTitle: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xLarge,
    fontWeight: FONTS.weights.bold,
    textTransform: "uppercase",
  },
  brandingDate: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.medium,
  },
});

export { GLOBAL_STYLES, COLORS, FONTS };
