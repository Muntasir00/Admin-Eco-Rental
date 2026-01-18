import {StateCreator} from 'zustand';
import {Blog, Pagination} from "@/types";
import {blogService} from "@/services/blog.service";

export interface BlogSlice {
    blogs: Blog[];
    blog: Blog | null;
    pagination: Pagination;

    // Loading States
    isLoadingBlogs: boolean; // List loading
    isLoading: boolean;      // Single blog loading
    isSubmitting: boolean;   // Create/Update loading
    isDeleting: boolean;     // Delete loading

    blogError: string | null;

    // Actions
    getBlogs: (page?: number) => Promise<void>;
    getBlog: (id?: string) => Promise<void>;     // changed from fetchBlog
    createBlog: (formData: FormData) => Promise<void>;
    updateBlog: (id: string, formData: FormData) => Promise<void>; // changed from editBlog
    deleteBlog: (id: string) => Promise<void>;   // changed from removeBlog

    // UI State
    isFormOpen: boolean;     // changed from isSheetOpen (Create/Edit)
    isDetailsOpen: boolean;  // changed from isBlogSheetOpen (View Single)

    selectedBlog: Blog | null;       // For Edit form
    selectedSingleBlog: Blog | null; // For Details view

    setFormOpen: (open: boolean, blog?: Blog | null) => void;
    setDetailsOpen: (open: boolean, blog?: Blog | null) => void;
}

export const createBlogSlice: StateCreator<BlogSlice> = (set, get) => ({
    blogs: [],
    blog: null,
    pagination: {page: 1, total: 0, totalPages: 1},

    isLoadingBlogs: false,
    isLoading: false,
    isDeleting: false,
    isSubmitting: false,
    blogError: null,

    // UI Initial State
    isFormOpen: false,
    isDetailsOpen: false,
    selectedBlog: null,
    selectedSingleBlog: null,

    // 1. READ ALL
    getBlogs: async (page = 1) => {
        set({isLoadingBlogs: true});
        try {
            const response = await blogService.getAll(page);
            set({
                blogs: response.blogs,
                pagination: {
                    page: response.page,
                    total: response.total,
                    totalPages: response.totalPages
                },
                isLoadingBlogs: false
            });
        } catch (error) {
            set({isLoadingBlogs: false, blogError: 'Failed to fetch blogs'});
            console.error(error);
        }
    },
    // 2. READ ONE
    getBlog: async (id: string | undefined) => {
        if (!id) return;
        set({isLoading: true});
        try {
            const data = await blogService.getById(id);
            set({blog: data.blog, isLoading: false});
        } catch (error) {
            set({isLoading: false});
            console.error(error);
        }
    },

    // 3. CREATE
    createBlog: async (formData) => {
        set({isSubmitting: true});
        try {
            await blogService.create(formData);
            await get().getBlogs(1); // Refresh list
            set({isFormOpen: false, isSubmitting: false, selectedBlog: null});
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    // 4. UPDATE
    updateBlog: async (id, formData) => {
        set({isSubmitting: true});
        try {
            await blogService.update(id, formData);
            await get().getBlogs(get().pagination.page); // Refresh current page
            set({isFormOpen: false, selectedBlog: null, isSubmitting: false});
        } catch (error) {
            set({isSubmitting: false});
            throw error;
        }
    },

    // 5. DELETE (Optimistic Update Fixed)
    deleteBlog: async (id) => {
        set({isDeleting: true});

        // ফিক্স: previousRooms -> previousBlogs
        const previousBlogs = get().blogs;

        // Optimistic UI Update: আগেই লিস্ট থেকে সরিয়ে দেওয়া হচ্ছে
        set({
            blogs: previousBlogs.filter(blog => blog._id !== id)
        });

        try {
            await blogService.delete(id);

            // সফল হলে বর্তমান পেজের ডেটা চেক করা
            const currentPagination = get().pagination;
            const currentBlogs = get().blogs; // এটা এখন অলরেডি ফিল্টার করা

            // যদি পেজের সব আইটেম ডিলিট হয়ে যায়, আগের পেজে যাওয়া
            if (currentBlogs.length === 0 && currentPagination.page > 1) {
                await get().getBlogs(currentPagination.page - 1);
            } else {
                await get().getBlogs(currentPagination.page);
            }

            set({isDeleting: false});
        } catch (error) {
            console.error("Delete failed, reverting state", error);
            // ফেইল করলে আগের স্টেট ফেরত আনা (Revert)
            set({
                blogs: previousBlogs,
                isDeleting: false
            });
            throw error;
        }
    },

    // Setters
    setFormOpen: (open, blog = null) => {
        set({isFormOpen: open, selectedBlog: blog});
    },

    setDetailsOpen: (open, blog = null) => {
        set({isDetailsOpen: open, selectedSingleBlog: blog});
    }

});