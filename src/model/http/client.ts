import type {UUID} from "node:crypto";

export interface Client {
    id: UUID,
    controller: ReadableStreamDefaultController<Uint8Array>
}
