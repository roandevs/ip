import React from 'react';
import Axios from 'axios';
import {
    Form,
    Button,
    Container,
    Row,
    Col
} from 'react-bootstrap';

import styles from './Search.module.css';

export default class Search extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            scraper: props.scrapers[0],
            ip: props.ip
        }
    }

    updateQuery(e){
        this.setState({
            ip: e.target.value
        });
    }

    updateScraper(e){
        this.setState({
            scraper: e.target.value
        });
    }

    async queryIp(e){
        e.preventDefault();
        try{
            const queryIpReq = await Axios.post('/api/query-ip', {
                'ip': this.state.ip,
                'scraper': this.state.scraper,
            });
            this.props.setIpDetails(queryIpReq.data.ipDetails);
        }
        catch(err){
            console.log(err);
            let errorMessage = (!err.response.data.message || err.response.data.message == "") ?  "There was an error, please contact an admin for more." : err.response.data.message;
            if(Number(err.response.status) === 429){
                errorMessage = err.response.data
            }
            return alert(errorMessage);
        }
    }    

    render(){
        return (
            <>
                <div id={styles['desktop-view']}>
                    <div id={styles['search-header']} className='container text-center d-flex justify-content-center'>
                        IP Address Lookup
                    </div>
                    <Form onSubmit={this.queryIp.bind(this)}>
                        <Container className='text-center d-flex justify-content-center'>
                            <Row className="justify-content-md-center">
                                <Col xs lg="5" id={styles['search-col']}>
                                    <Form.Group className="mb-3" controlId="formIpAddress">
                                        <Form.Label id={styles['search-label']} className="text-muted">Enter the IP address you're curious about:</Form.Label>
                                        <Form.Control id={styles['search-input']} type="text" value={this.state.ip} onChange={this.updateQuery.bind(this)} />
                                        <Form.Select onChange={this.updateScraper.bind(this)} id={styles['search-provider-choice']}>
                                            {this.props.scrapers.map((scraper) => (
                                                <option value={scraper}>Search with: {scraper}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs lg="3">
                                    <Button id={styles['search-btn']} variant="primary" type="submit">
                                        Get IP Details
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </div>
                <div id={styles['mobile-view']}>
                    <div id={styles['search-header']} className='container text-center d-flex justify-content-center'>
                        IP Address Lookup
                    </div>
                    <Form onSubmit={this.queryIp.bind(this)}>
                        <Container className='text-center d-flex justify-content-center'>
                            <Row className="justify-content-md-center">
                                <Col xs lg="5" id={styles['search-col']}>
                                    <Form.Group className="mb-3" controlId="formIpAddress">
                                        <Form.Label id={styles['search-label']} className="text-muted">Enter the IP address you're curious about:</Form.Label>
                                        <Form.Control id={styles['search-input']} type="text" value={this.state.ip} onChange={this.updateQuery.bind(this)} />
                                        <Form.Select onChange={this.updateScraper.bind(this)} id={styles['search-provider-choice']}>
                                            {this.props.scrapers.map((scraper) => (
                                                <option value={scraper}>Search with: {scraper}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Button id={styles['search-btn']} variant="primary" type="submit">
                                        Get IP Details
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </div>
            </>
        )
    }
}