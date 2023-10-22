import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function makeIconRender(name) {
    return ({ color, size }) => (
      <MaterialCommunityIcons name={name} color={color} size={size} />
    );
  }