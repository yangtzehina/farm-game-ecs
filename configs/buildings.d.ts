export declare enum BuildingType {
    WELL = "well",
    FARMLAND = "farmland",
    LIVESTOCK_PEN = "livestock_pen",
    PROCESSING_WORKSHOP = "processing_workshop",
    WAREHOUSE = "warehouse",
    MARKET = "market"
}
export interface BuildingLevelConfig {
    level: number;
    upgradeCost: {
        gold: number;
        wood: number;
        stone: number;
        crop?: number;
    };
    buff: {
        [key: string]: number;
    };
    description: string;
}
export interface BuildingConfig {
    id: BuildingType;
    name: string;
    icon: string;
    maxLevel: number;
    levels: BuildingLevelConfig[];
}
export declare const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig>;
export declare function getBuildingLevelConfig(type: BuildingType, level: number): BuildingLevelConfig | undefined;
export declare function getBuildingUpgradeCost(type: BuildingType, currentLevel: number): BuildingLevelConfig['upgradeCost'] | undefined;
