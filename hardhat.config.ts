import "dotenv/config"
import "tsconfig-paths/register"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"

module.exports = {
    networks: {
        hardhat: {},
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
}
