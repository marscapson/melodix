import fetch from 'node-fetch'

const isExist = async (wallet) => {
    return await fetch(`https://rpc.qubic.org/v1/balances/${wallet}`)
        .then(response => response.json())
        .then(data => { return data.balance ? true : false })
        .catch(error => { return false })
}

export default { isExist }