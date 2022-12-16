import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {make, regex} from "simple-body-validator";
import _ from 'lodash';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {createDonation, getCampaigns} from "../services/CampaignService";
import CurrencyService from '../services/CurrencyService';

export async function getServerSideProps(context) {
    const campaigns = await getCampaigns();
    const currencies = await CurrencyService.getCurrencies();

    return {
        props: {
            campaigns: campaigns.data,
            currencies: currencies.data,
        },
    }
}

const Home = (props) => {
    const [loadingMore, setloadingMore] = useState(false);
    const [pagination, setPagination] = useState(props.campaigns.pagination);
    const [campaigns, setCampaigns] = useState(props.campaigns.items);
    const [currencies, setCurrencies] = useState(props.currencies);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    useEffect(() => {
        const handleScrolling = async () => {
            const totalPageHeight = document.body.scrollHeight;
            const scrollPoint = window.scrollY + window.innerHeight;

            if (scrollPoint >= totalPageHeight && pagination.nextPage !== null) {
                console.log('scrolled to bottom');
                setloadingMore(true);
            }
        }

        window.addEventListener('scroll', _.throttle(handleScrolling, 1000));

        return () => {
            window.removeEventListener('scroll', _.throttle(handleScrolling, 1000));
        };
    }, [])

    useEffect(async () => {
        if (loadingMore && pagination.nextPage !== null) {
            const campaigns = await getCampaigns({page: pagination.nextPage, perPage: pagination.perPage});

            setCampaigns(oldCampaigns => [...oldCampaigns, ...campaigns.data.items]);
            setPagination(campaigns.data.pagination);

            setloadingMore(false);
        }
    }, [loadingMore, setloadingMore]);

    const handleShowModal = (campaign) => {
        setModalData(campaign);
        setShowModal(true);
    }
    const handleCloseModal = () => setShowModal(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data['campaignId'] = modalData.id;

        // Run the data through validator
        const validator = make(data, {
            campaignId: ['required'],
            currencyId: ['required'],
            nickname: ['required', 'alpha_dash'],
            amount: ['required', regex(/^[0-9]*(\.[0-9]{0,2})?$/)],
        });

        if (!validator.validate()) {
            return alert(JSON.stringify(validator.errors().all()));
        }

        // Create a new donation record
        const response = await createDonation(data);

        if (response.status === 200) {
            alert('Successfully created!');
            handleCloseModal();
        }
    }

    return (
        <React.Fragment>
            <div className="container-table100">
                <div className="wrap-table100">
                    <div className="table100 ver1">
                        <table data-vertable="ver1">
                            <thead>
                            <tr className="row100 head">
                                <th className="column100 column2" data-column="column2">Campaign</th>
                                <th className="column100 column1" data-column="column1">Description</th>
                                <th className="column100 column3" data-column="column3">Target</th>
                                <th className="column100 column4" data-column="column4">Expiry</th>
                                <th className="column100 column5" data-column="column5">Make a Donation</th>
                            </tr>
                            </thead>
                            <TransitionGroup component="tbody">
                                {
                                    campaigns.length && campaigns.map((campaign, i) => (
                                        <CSSTransition key={i} timeout={500} classNames="item">
                                            <tr className="row100" key={i}>
                                                <td className="column100 column2" data-column="column2">{campaign.name}</td>
                                                <td className="column100 column1"
                                                    data-column="column1">{campaign.description}</td>
                                                <td className="column100 column3"
                                                    data-column="column3">{campaign.target}</td>
                                                <td className="column100 column4"
                                                    data-column="column4">{campaign.expiry}</td>
                                                <td className="column100 column5" data-column="column5">
                                                    <Button variant="success" className="w-100 rounded-1 py-2"
                                                            onClick={() => handleShowModal(campaign)}>Donate</Button>
                                                </td>
                                            </tr>
                                        </CSSTransition>
                                    ))
                                }
                            </TransitionGroup>
                        </table>
                    </div>
                </div>
            </div>

            <Modal size="lg" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Make a donation for {modalData.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control type="text" name="nickname" placeholder="Enter your nickname"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Currency</Form.Label>
                            <Form.Select name="currencyId" defaultValue="" required>
                                <option value="">Open this select menu</option>
                                {
                                    currencies.length && currencies.map((currency, i) => (
                                        currency.type === 'crypto'
                                            ? <option value={currency.id} key={i}>Crypto - {currency.code}</option>
                                            : <option value={currency.id} key={i}>{currency.code}</option>
                                    ))
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text" name="amount" className="form-control"
                                          placeholder="Enter your amount"/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" className="rounded-1" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" className="rounded-1">
                            Complete donation
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default Home;
