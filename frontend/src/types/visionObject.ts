export interface VisionObject {

    name:string;

    description:string;

    confidence:number;


    box:{
        x:number;
        y:number;
        width:number;
        height:number;
    };

}