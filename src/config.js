'use strict';

module.exports = {
  ports: [8080, 8443],
  mongodb: "mongodb://localhost:27017/nodepop",
  privateKey: `/etc/letsencrypt/live/autodeluxegarage.es/privkey.pem`,
  certificate: `/etc/letsencrypt/live/autodeluxegarage.es/cert.pem`,
  ca: `/etc/letsencrypt/live/autodeluxegarage.es/chain.pem`,
}