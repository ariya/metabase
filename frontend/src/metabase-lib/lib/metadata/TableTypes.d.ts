interface Flavoring<FlavorT> {
    _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type EntityType = Flavor<string, "EntityType">;

export type SchemaName = Flavor<string, "SchemaName">;
