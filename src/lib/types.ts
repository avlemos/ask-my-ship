export interface PlayerStats {
    battles_count?: number;
    wins?: number;
    damage_dealt?: number;
    frags?: number;
    survived_battles?: number;
    ships_spotted?: number;
    exp?: number;
    max_damage_dealt?: number;
    max_frags_battle?: number;
    max_planes_killed?: number;
    max_ships_spotted?: number;
    max_exp?: number;
    main_battery_hits?: number;
    main_battery_shots?: number;
    warships?: {
      [key: string]: {
        battles: number;
        wins: number;
        damage_dealt: number;
        max_damage_dealt: number;
      };
    };
  }