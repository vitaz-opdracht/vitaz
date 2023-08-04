import {Specialty} from "../specialty/specialty";

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialty: Specialty;
}
