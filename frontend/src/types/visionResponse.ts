import type { VisionObject } from "./visionObject";


export interface VisionResponse {

    answer:string;

    objects:VisionObject[];

}