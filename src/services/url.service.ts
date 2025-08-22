import { serverconfig } from "../config/server";
import { CacheRepository } from "../repositories/cache.repo";
import { URLRepository } from "../repositories/url.repo";
import { InternalServerError } from "../utils/app.error";
import { toBase62 } from "../utils/base62";

export class UrlService {
    constructor(private readonly urlrepository: URLRepository, private readonly cacherepository: CacheRepository) {

    }
    async createShortUrl(originalUrl: string) {
        const nextId = await this.cacherepository.getNextId();
        const shortUrl = toBase62(nextId);
        const url = await this.urlrepository.create({
            originalUrl,
            shortUrl
        })
        await this.cacherepository.setUrlMapping(shortUrl, originalUrl);//cache the url mapping
        const baseurl = serverconfig.BASE_URL;
        const fullurl = `${baseurl}/${shortUrl}`
        return {
            id: url.id.toString(),
            shortUrl,
            originalUrl,
            fullurl,
            createdAt: url.createdAt,
            updateAt: url.updatedAt
        }
    }
    async getOriginalUrl(shortUrl: string) {
        const originalUrl = await this.cacherepository.getUrlMapping(shortUrl);
        if (originalUrl) {
            await this.urlrepository.incrementClicks(shortUrl)
            return {
                originalUrl,
                shortUrl
            }
        }
        const url = await this.urlrepository.findByShortUrl(shortUrl);
        if (!url) {
            throw new InternalServerError("url not founded")
        }
        await this.urlrepository.incrementClicks(shortUrl)
        await this.cacherepository.setUrlMapping(shortUrl, url.originalUrl)
        return {
            originalUrl: url.originalUrl,
            shortUrl
        }

    }
    async incrementClicks(shortUrl:string){
        await this.urlrepository.incrementClicks(shortUrl);
        return ;
    }
}
