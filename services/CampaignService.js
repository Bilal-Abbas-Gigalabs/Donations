import axios from "axios";

export async function getCampaigns(pagination = {page: 1, perPage: 25}) {
    let url = `http://${process.env.NEXT_PUBLIC_APP_HOST}:${process.env.NEXT_PUBLIC_APP_PORT}/api/campaigns`;

    for (const [key, val] of Object.entries(pagination)) {
        switch (pagination.page === val){
            case true:
                url += `?${key}=${val}`;
                break;

            default:
                url += `&${key}=${val}`;
                break;
        }
    }

    const response = await axios.get(url);

    return response.data;
}

export async function createDonation(data) {
    const response = await axios.post(`http://${process.env.NEXT_PUBLIC_APP_HOST}:${process.env.NEXT_PUBLIC_APP_PORT}/api/campaigns`, data);

    return response.data;
}