import { ObjectId } from "mongodb"

export type queryType = {
    _id: ObjectId,
    query: string,
    answer: string,
    vetos: number,
    timestamp: Date,
}

export type metadataType = {
    _id: any,
    query_count: number
}