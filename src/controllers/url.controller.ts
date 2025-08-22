import { z } from "zod"
import { publicProcedure } from "../routers/trpc/context"
import { UrlService } from "../services/url.service"
import { InternalServerError } from "../utils/app.error"
import logger from "../config/logger.config"
import { URLRepository } from "../repositories/url.repo"
import { CacheRepository } from "../repositories/cache.repo"
import { Request, Response } from "express"


const urlService=new UrlService(new URLRepository(),new CacheRepository());


export const urlController={
create:publicProcedure
    .input(
        z.object({
            originalUrl:z.string()
        })
    )
    .mutation(async({input})=>{
        try {
            console.log("then input is",input.originalUrl)
            const result =await urlService.createShortUrl(input.originalUrl)
            return result
        } catch (error) {
            logger.error("error creating short url",error)
            throw new InternalServerError("failed to create short url")
            
        }
    }),

    getOriginalUrl:publicProcedure
    .input(
        z.object({
            shortUrl:z.string()
        })
    )
    .query(async({input})=>{
        try {
            const result =await urlService.getOriginalUrl(input.shortUrl)
            return result
        } catch (error) {
            logger.error("error creating short url",error)
            throw new InternalServerError("failed to create short url")
            
        }
    }
    )
}
export async function redirecturl(req:Request,res:Response){
        const {shortUrl}=req.params;
        const urlService=new UrlService(new URLRepository(),new CacheRepository());
        const url=await urlService.getOriginalUrl(shortUrl);
        if(!url){
            res.status(404).json({
                success:false,
                message:"url not found"
            });
            return ;
        }
        await urlService.incrementClicks(shortUrl);
        res.redirect(url.originalUrl);


}