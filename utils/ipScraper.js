const axios = require('axios');

/* 
Every scraper returns an array of objects, which will describe how it'll be laid out on the front-end

Each object in the array contains the fields for each row that will be rendered on the front-end, heres an example

[{'IP Address': 2.2.2.2, 'ISP': 'example inc', 'Hostname': 'example.com'}, {'City': 'London', 'Country': 'GB'}]

will be rendered like so:

IP Address       ISP           Hostname

2.2.2.2        example inc   example.com

City             Country

London              GB        
*/

const scrapers = {
    'NordVPN': async (ip) => {
        try{
            const getIpInfoReq = await axios.get(`https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data&ip=${ip}`);
            return {
                'desktopView': [
                    {
                        'IP Address': getIpInfoReq.data.ip ? getIpInfoReq.data.ip : 'N/A',
                        'Internet Service Provider': getIpInfoReq.data.isp ? getIpInfoReq.data.isp : 'N/A',
                        'Country Code': getIpInfoReq.data.country_code ? getIpInfoReq.data.country_code : 'N/A',
                       
                    },
                    {
                        'Country': getIpInfoReq.data.country ? getIpInfoReq.data.country : 'N/A',
                        'Region': getIpInfoReq.data.region ? getIpInfoReq.data.region : 'N/A',
                        'Area Code': getIpInfoReq.data.area_code ? getIpInfoReq.data.area_code : 'N/A',
                    },
                ],
                'mobileView': [
                    {
                        'IP Address': getIpInfoReq.data.ip ? getIpInfoReq.data.ip : 'N/A',
                    },
                    {
                        'Internet Service Provider': getIpInfoReq.data.isp ? getIpInfoReq.data.isp : 'N/A',
                    },
                    {
                        'Country Code': getIpInfoReq.data.country_code ? getIpInfoReq.data.country_code : 'N/A',
                        'Country': getIpInfoReq.data.country ? getIpInfoReq.data.country : 'N/A',
                    },
                    {
                        'Region': getIpInfoReq.data.region ? getIpInfoReq.data.region : 'N/A',
                        'Area Code': getIpInfoReq.data.area_code ? getIpInfoReq.data.area_code : 'N/A',
                    }
                ],
            }
        }
        catch(e){
            console.log(e);
            return null;
        }
    },

    'iphostinfo.com': async (ip) => {
        try{
            const req = await axios.get(`https://iphostinfo.com/${ip}`);
            const getData = (data, field) => {
                const splitContent = data.split(`${field}: <b><font color='#0000000'>`);
                if(splitContent[1]){
                    const scrapedData = splitContent[1].split('</font></b><br />');
                    if(scrapedData[0]) return scrapedData[0];
                }
                return null;
            }
            const city = getData(req.data, 'City');
            const region = getData(req.data, 'Region');
            const country = getData(req.data, 'Country');
            const postcode = getData(req.data, 'Postal Code');
        
            const coords = getData(req.data, 'Latitude,Longitude');
            const organization = getData(req.data, 'Organization');
            const isp = getData(req.data, 'Isp')
            const continent = getData(req.data, 'Continent')
            return {
                'desktopView':  [
                    {
                        'City': city,
                        'Region': region,
                        'Country': country,
                        'Postal Code': postcode,
                    
                    },
                    {
                        'Latitude,Longitude': coords,
                        'Organization': organization,
                        'ISP': isp,
                        'Continent': continent,
                    },
                ],
                'mobileView':  [
                    {
                        'City': city,
                        'Region': region,
                    },
                    {
                        'Country': country,
                        'Postal Code': postcode,
                    },
                    {
                        'Latitude,Longitude': coords,
                    },
                    {'Organization': organization},
                    {
                        'ISP': isp,
                        'Continent': continent,
                    },
                ]
            }
        }
        catch(e){
            console.log(e);
            return null;
        }
    },

    'whatismyip.com': async (ip) => { 
        try{
            const req = await axios.get(`https://api.whatismyip.com/ip-address-lookup.php?key=${process.env.API_KEY}&input=${ip}`);
            const getData = (data, field) => {
                const splitContent = data.split(`${field}:`);

                if(splitContent[1]){
                    const scrapedData = splitContent[1].split('  \r');
                    if(scrapedData[0]) return scrapedData[0];
                }
                return null;
            }
            return {
                'desktopView': [
                    {
                        'IP Address': getData(req.data, 'ip'),
                        'ASN': getData(req.data, 'asn'),
                        'Country': getData(req.data, 'country'),
                        'Region': getData(req.data, 'region'),
                    
                    },
                    {
                        'City': getData(req.data, 'city'),
                        'Postal Code': getData(req.data, 'postalcode'),
                        'ISP': getData(req.data, 'isp'),
                        'Time': getData(req.data, 'time'),
                    },
                    {
                        'Latitude': getData(req.data, 'latitude'),
                        'Longitude': getData(req.data, 'longitude'),
                    },
                ],
                'mobileView': [
                    {
                        'IP Address': getData(req.data, 'ip'),
                        'ASN': getData(req.data, 'asn'),
                        'Country': getData(req.data, 'country'),
                    
                    },{
                        'Region': getData(req.data, 'region'),
                    },
                    {
                        'City': getData(req.data, 'city'),
                        'Postal Code': getData(req.data, 'postalcode'),
                    },
                    {
                        'ISP': getData(req.data, 'isp'),
                        'Time': getData(req.data, 'time'),
                    },
                    {
                        'Latitude': getData(req.data, 'latitude'),
                        'Longitude': getData(req.data, 'longitude'),
                    },
                ]
            }
        }
        catch(e){
            console.log(e);
            return null;
        }
    }
}

module.exports.getScraperByName = (name) => {
    if(!scrapers[name]){
        return null;   
    }
    return scrapers[name];
}

module.exports.getScrapers = () => {
    return Object.keys(scrapers);
}