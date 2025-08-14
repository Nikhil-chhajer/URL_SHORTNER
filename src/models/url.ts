import mongoose,{Document,Schema} from "mongoose";





export interface IURL extends Document{
    originalUrl:string,
    shortUrl:string,
    clicks:number,
    createdAt:Date,
    updatedAt:Date

}
const urlschema=new Schema<IURL>({
    originalUrl:{type:String,required:true},
    shortUrl:{type:String,required:true,unique:true,index:true},
    clicks:{type:Number,default:0}

},{timestamps:true})

urlschema.index({createdAt:-1})

export const Url=mongoose.model<IURL>('Url',urlschema);
