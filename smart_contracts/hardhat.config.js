// https://eth-goerli.g.alchemy.com/v2/s-4w0yD01X35YwPpJwAXu29GjJ5xw4QW

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli:{
      url: 'https://eth-goerli.g.alchemy.com/v2/s-4w0yD01X35YwPpJwAXu29GjJ5xw4QW',
      accounts: ['8491ddebb3decd063b03d415dc4242c148d7850b429132e0999b151956be3322']
    }
  }
}