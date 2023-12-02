import { ObjectId } from "mongodb"

export type queryType = {
    _id: ObjectId;
    query: string;
    answer: string;
    vetos: number;
    updates: number;
    timestamp: Date;
    index: number;
}

export type metadataType = {
    _id: ObjectId;
    queries_created: number;
    queries_deleted: number;
}