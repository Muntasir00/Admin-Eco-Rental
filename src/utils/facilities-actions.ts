import axios, {endpoints} from "@/utils/axios";
import {FacilityPayload} from "@/types";

export const getFacilities = async (page: number = 1) => {
    const res = await axios.get(endpoints.facilities.getAllFacilities, {
        params: {page},
    });
    return res.data;
};

export const createFacility = async (data: FacilityPayload) => {
    const res = await axios.post(endpoints.facilities.createFacilities, data);
    return res.data;
};

export const updateFacility = async (id: string, data: any) => {
    const res = await axios.put(`${endpoints.facilities.updateFacilities}/${id}`, data);
    return res.data;
};

export const deleteFacilityApi = async (id: string) => {
    const res = await axios.delete(`${endpoints.facilities.deleteFacilities}/${id}`);
    return res.data;
};