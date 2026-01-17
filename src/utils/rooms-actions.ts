import axios, {endpoints} from "@/utils/axios";

export const getRooms = async (page: number = 1) => {
    const res = await axios.get(endpoints.rooms.allRooms, {
        params: {page}
    });
    return res.data;
};

export const createRoom = async (formData: FormData) => {
    const res = await axios.post(endpoints.rooms.createRoom, formData)
    return res.data
}
export const updateRoom = async (id: string, formData: FormData) => {
    const res = await axios.put(`${endpoints.rooms.updateRoom}/${id}`, formData)
    return res.data
}

export const getRoom = async (id: string) => {
    const res = await axios.get(`${endpoints.rooms.singleRoom}/${id}`);
    return res.data;
};

export const deleteRoom = async (id: string) => {
    const res = await axios.delete(`${endpoints.rooms.delete}/${id}`);
    return res.data;
};

