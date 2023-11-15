'use strict';

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCauxCeG97TowsL0BgClWoidAx4IbKs2vs',
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = { geocoder };