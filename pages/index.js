import React from "react";
import Head from 'next/head';

import Search from '@/components/Search';
import Details from '@/components/Details';
import {getIp} from '@/utils/getIp';
import {getScraperByName, getScrapers} from '@/utils/ipScraper';


export async function getServerSideProps({ req, res }){
    const scrapers = getScrapers();
    const useDefaultScraper = getScraperByName(scrapers[0]); /* getting first available scraper in object */
    const ip = getIp(req);
    const ipDetails = await useDefaultScraper(ip);    
    return {
        props: {
            ipDetails: ipDetails, 
            scrapers: scrapers, 
            ip: ip
        }
    }
}

export default class IP extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ipDetails: props.ipDetails
        }
    }

    setIpDetails(ipDetails){
        this.setState({
            ipDetails: ipDetails
        })
    }

    render(){  
        return (  
            <>
                <Head>
                    <meta name="description" content="An open-source, easy to use IP look up tool" />
                    <meta name="keywords" content={`ip, what is my ip, ip lookup, my ip`} />
                    <title>IP Address Lookup</title>
                    <meta property="og:title" content={`${this.props.ipDetails[0]['IP Address']} - ${this.props.ipDetails[0]['Internet Service Provider']}`}/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:url" content="/"/>
                    <meta property="og:description" content={
                        this.props.ipDetails.map((obj) => {
                            return Object.keys(obj).map((key) => {
                                return `${key}: ${obj[key]}`
                            }).join(', ')
                        })
                    } />
                    
                </Head>
                <Search setIpDetails={this.setIpDetails.bind(this)} ip={this.props.ip} scrapers={this.props.scrapers}/>
                <Details ipDetails={this.state.ipDetails}/>
            </> 
        )
    }
}