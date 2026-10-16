import type { SportType } from "@/models/event";

export interface StudioOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
}

export const SPORT_OPTIONS: StudioOption<SportType>[] = [
  { value: "SWIMMING", label: "Swim", icon: "pool" },
  { value: "RUNNING", label: "Run", icon: "directions-run" },
  { value: "CYCLING", label: "Cycle", icon: "directions-bike" },
];

export const SWIMMING_OPTIONS: StudioOption[] = [
  { value: "OCEAN", label: "Ocean" },
  { value: "LAKE", label: "Lake" },
  { value: "POOL", label: "Pool" },
];

export const RUNNING_OPTIONS: StudioOption[] = [
  { value: "ROAD", label: "Road" },
  { value: "TRAIL", label: "Trail" },
  { value: "MIXED", label: "Mixed" },
];

export const CYCLING_OPTIONS: StudioOption[] = [
  { value: "ROAD", label: "Road" },
  { value: "GRAVEL", label: "Gravel" },
  { value: "MIXED", label: "Mixed" },
];

export function getVenueConfig(sport?: SportType) {
  switch (sport) {
    case "RUNNING":
      return {
        label: "Running",
        options: RUNNING_OPTIONS,
        hint: "Run show Terrain instead: Road, Trail or Mixed.",
      };
    case "CYCLING":
      return {
        label: "Cycling",
        options: CYCLING_OPTIONS,
        hint: "Cycle show Terrain instead: Road, Gravel or Mixed.",
      };
    default:
      return {
        label: "Swimming",
        options: SWIMMING_OPTIONS,
        hint: "Swim show Venue instead: Ocean, Lake or Pool.",
      };
  }
}
