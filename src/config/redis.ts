import { createClient } from "redis";
import { serverconfig } from "./server";


export const redisclient=createClient({
    url:serverconfig.REDIS_URL,

});

redisclient.on('error',(err)=>{
    console.log("redis not connected",err)
})
redisclient.on('connect',()=>{
    console.log("redis connected")
})
export async function initRedis(){
    try {
        await redisclient.connect();
        console.log("")

    } catch (error) {
        console.log("Redis is not connected",error)
        
    }
}



export async function closeRedis(){
await redisclient.quit()
}
