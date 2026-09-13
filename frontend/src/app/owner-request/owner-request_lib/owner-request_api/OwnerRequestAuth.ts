export const authApi = { ownerRequests: { create: async (data: unknown) => { return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500)); } } };
