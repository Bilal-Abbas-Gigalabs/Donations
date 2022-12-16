'use strict';
const {Currency} = require('../models');

class CurrencyController {
    constructor() {
        this.index = this.index.bind(this);
    }

    async index(request, response) {
        const data = await Currency.findAll();

        return response.json({
            status: 200,
            data: data
        });
    }
}

module.exports = new CurrencyController();