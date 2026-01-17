import {StateCreator} from 'zustand';
import {Blog, Pagination} from "@/types";
import {createBlog, deleteBlog, getBlog, getBlogs, updateBlog} from "@/utils/blogs-actions";

export interface BlogSlice {
    blogs: Blog[];
    blog: Blog | null; // null এলাউ করা ভালো, লোডিং স্টেটের জন্য
    pagination: Pagination;
    isLoadingBlogs: boolean;
    isLoading: boolean;
    isDeleting: boolean;
    blogError: string | null;
    isSubmitting: boolean;

    // Actions
    fetchBlogs: (page?: number) => Promise<void>;
    fetchBlog: (id?: string) => Promise<void>;
    addBlog: (formData: FormData) => Promise<void>;
    editBlog: (id: string, formData: FormData) => Promise<void>;
    removeBlog: (id: string) => Promise<void>;

    // UI State for Sheet
    isSheetOpen: boolean;     // For Edit/Create Form
    isBlogSheetOpen: boolean; // For Single Blog View
    selectedBlog: Blog | null;
    selectedSingleBlog: Blog | null;
    setSheetOpen: (open: boolean, blog?: Blog | null) => void;
    setBlogSheetOpen: (open: boolean, blog?: Blog | null) => void;
}

export const createBlogSlice: StateCreator<BlogSlice> = (set, get) => ({
    blogs: [],
    blog: null,
    pagination: {page: 1, total: 0, totalPages: 1},
    isLoadingBlogs: false,
    isLoading: false,
    isDeleting: false,
    isSheetOpen: false,
    isBlogSheetOpen: false,
    selectedBlog: null,
    selectedSingleBlog: null,
    blogError: null,
    isSubmitting: false,

    fetchBlogs: async (page = 1) => {
        set({isLoadingBlogs: true});
        try {
            const data = await getBlogs(page);
            set({
                blogs: data.blogs,
                pagination: {page: data.page, total: data.total, totalPages: data.totalPages},
                isLoadingBlogs: false
            });
        } catch (error) {
            set({isLoadingBlogs: false});
            console.log(error);
        }
    },

    // গত প্রশ্নের ফিক্সটি এখানে অ্যাপ্লাই করা হয়েছে (Perfect)
    fetchBlog: async (id: string | undefined) => {
        if (!id) {
            console.error("Blog ID is missing!");
            return;
        }
        set({isLoading: true});
        try {
            const data = await getBlog(id);
            set({
                blog: data.blog,
                isLoading: false
            })
        } catch (error) {
            set({isLoading: false});
            console.log(error);
        }
    },

    addBlog: async (formData) => {
        set({isSubmitting: true});
        try {
            await createBlog(formData);
            await get().fetchBlogs(1); // নতুন ব্লগ অ্যাড হলে প্রথম পেজে রিফ্রেশ
            set({isSheetOpen: false, isSubmitting: false, selectedBlog: null});
        } catch (error) {
            console.error("Create failed", error);
            set({isSubmitting: false});
            throw error;
        }
    },

    editBlog: async (id, formData) => {
        set({isSubmitting: true});
        try {
            await updateBlog(id, formData);
            // যেই পেজে আছেন সেই পেজটি রিফ্রেশ হবে
            await get().fetchBlogs(get().pagination.page);
            set({isSheetOpen: false, selectedBlog: null, isSubmitting: false});
        } catch (error) {
            console.error("Update failed", error);
            set({isSubmitting: false});
            throw error;
        }
    },

    // removeBlog: async (id) => {
    //     set({isDeleting: true});
    //     try {
    //         await deleteBlog(id);
    //         const currentBlogs = get().blogs;
    //         const currentPagination = get().pagination;
    //         const newTotal = Math.max(0, currentPagination.total - 1);
    //         set({
    //             blogs: currentBlogs.filter(blog => blog._id !== id),
    //             pagination: {
    //                 ...currentPagination,
    //                 total: newTotal,
    //             },
    //             isDeleting: false
    //         });
    //     } catch (error) {
    //         set({isDeleting: false});
    //         console.log(error);
    //         // এখানে এরর throw করতে পারেন যাতে UI তে toast দেখানো যায়
    //         throw error;
    //     }
    // },
    removeBlog: async (id) => {
        set({isDeleting: true});
        const previousRooms = get().blogs;
        set({
            blogs: previousRooms.filter(room => room._id !== id)
        });
        try {
            await deleteBlog(id)
            const currentPagination = get().pagination;
            const currentBlogs = get().blogs;
            if (currentBlogs.length === 0 && currentPagination.page > 1) {
                await get().fetchBlogs(currentPagination.page - 1);
            } else {
                await get().fetchBlogs(currentPagination.page);
            }
            set({isDeleting: false});
        } catch (error) {
            console.log(error);
            set({
                blogs: previousRooms,
                isDeleting: false
            });
            throw error;
        }
    },

    setSheetOpen: (open, blog = null) => {
        set({isSheetOpen: open, selectedBlog: blog});
    },

    // ফিক্স করা হয়েছে: এখন সঠিক ভেরিয়েবল আপডেট হচ্ছে
    setBlogSheetOpen: (open, blog = null) => {
        set({isBlogSheetOpen: open, selectedSingleBlog: blog});
    }
});