export type SpaceObjectJsonNode = {
    title: string;
    distance: number;
    velocity: number;
    mass: number;
    radius: number;
    color: string;
    orbitals?: SpaceObjectJsonNode[];
};

