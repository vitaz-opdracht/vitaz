export interface PaginatedResource<Entity> {
    data: Entity[];
    totalRecords: number;
}
