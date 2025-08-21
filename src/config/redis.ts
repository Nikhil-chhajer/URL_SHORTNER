import { createClient } from "redis";
import { serverconfig } from "./server";


export const redisClient=createClient({
    url:serverconfig.REDIS_URL,

});

redisClient.on('error',(err)=>{
    console.log("redis not connected",err)
})
redisClient.on('connect',()=>{
    console.log("redis connected")
})
export async function initRedis(){
    try {
        await redisClient.connect();
        console.log("")

    } catch (error) {
        console.log("Redis is not connected",error)
        
    }
}



export async function closeRedis(){
await redisClient.quit()
}
