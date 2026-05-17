import { config as tamaguiConfig } from "@tamagui/config";
import { createTamagui } from "tamagui";

const config = createTamagui(tamaguiConfig);

export default config;
export type AppConfig = typeof config;
