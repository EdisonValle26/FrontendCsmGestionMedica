import { Catalogs } from "./catalog.interface";

export interface CatalogsType {
    id?: number;
    code?: string;
    name: string;
    totalItems?: number;
    items?: Catalogs[];
}