import fetch from 'node-fetch'

const isExist = async (wallet) => {
    return await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${wallet}`)
        .then(response => response.json())
        .then(data => { return data.ok ? true : false })
        .catch(error => { return false })
}

export default { isExist }