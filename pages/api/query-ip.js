const {getScrapers, getScraperByName} = require('@/utils/ipScraper');
const {getIp} = require('@/utils/getIp');
const rateLimit = require('express-rate-limit');

const rateLimitOptions = rateLimit({
    windowMs: 5 * 60 * 1000, // every 5 minutes
    max: 15, // Limit each IP to 15 app requests per `window` (here, per 5 minutes)
    message: 'You are sending API requests too quickly, please try again in 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default async function queryIp(req, res) {
    if(req.method === 'POST'){
        if(!validateStr(req.body.ip)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, please provide a valid string for the IP address',
                successful: false
            });
        }
                
        if(!validateStr(req.body.scraper)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, please provide a valid string for the scraper',
                successful: false
            });
        }        

        const availableScrapers = getScrapers();
        if(!availableScrapers.includes(req.body.scraper)){
            return res.status(400).json({
                message: 'You sent an invalid type of request, the scraper you sent is not a valid scraper',
                successful: false
            });
        }
        const ip = getIp(req);
        req.ip = ip;
        try{ 
            await runRateLimitCheck(req, res, rateLimitOptions);
        }
        catch(e){
            return res.status(429).json({
                message: 'You are being rate limited, please wait for 5 minutes before retrying',
                successful: false
            });
        }
        const scraper = getScraperByName(req.body.scraper);
        const ipDetails = await scraper(req.body.ip);    
        return res.send(JSON.stringify({
            message: '',
            successful: true,
            ipDetails: ipDetails
        }));
    }
    return res.status(400).json({
        message: 'You sent an invalid type of request, please send a POST request.',
        successful: false
    });
}

const validateStr = (value) => {
    return typeof value === 'string';
}

const runRateLimitCheck = (req, res, fn) =>  {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}