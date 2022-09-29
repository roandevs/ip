# IP Lookup Tool

## Information

- This is an easy to use IP look-up tool built with NextJS, can be hosted for free on Vercel. 

- If you wish to use whatismyip.com as a provider, set API_KEY in your .env file to your api key you get from the site. It's free to register for one, but if you want to remove that provider altogether then remove it from ipScraper.js.

## Features

- Allows support to query multiple providers (found in ipScraper.js) for IP data 

- Updates search smoothly, without reloading the page.

- Allows input via URL query i.e. example.com/1.2.3.4, and stores the IP data in the meta tags (specifically in the og:description one) so that on platforms like Discord, you can view it just by sending 'example.com/1.2.3.4' in the chat, and it'll show the details embedded. 


# Plans

- I may improve the design in the future, as right now it's quite obviously an inspiration of whoer.net's website and NordVPN's one combined together.

- May add a feature to use https://getipintel.com's API to determine whether an IP is a proxy/VPN or not.