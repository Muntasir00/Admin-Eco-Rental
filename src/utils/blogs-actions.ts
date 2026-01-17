import axios, { endpoints } from "@/utils/axios";

export const getBlogs = async (page: number = 1) => {
    const res = await axios.get(endpoints.blogs.blogs, {
        params: { page }
    });
    return res.data.blogs;
};

export const createBlog = async (formData: FormData) => {
    const res = await axios.post(endpoints.blogs.create, formData)
    return res.data
}

export const updateBlog = async (id: string,formData: FormData) => {
    const res = await axios.put(`${endpoints.blogs.update}/${id}`, formData)
    return res.data
}

export const getBlog = async (id: string) => {
    const res = await axios.get(`${endpoints.blogs.blogs}/${id}`);
    return res.data.blog;
};

export const deleteBlog = async (id: string) => {
    const res = await axios.delete(`${endpoints.blogs.delete}/${id}`);
    return res.data;
};