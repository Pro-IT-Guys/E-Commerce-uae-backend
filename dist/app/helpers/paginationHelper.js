"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationHelper = (option) => {
    const page = Number(option.page) || 1;
    const limit = Number(option.limit) || 12;
    const skip = (page - 1) * limit;
    const sortBy = option.sortBy || 'createdAt';
    const sortOrder = option.sortOrder || 'desc';
    return { page, limit, skip, sortBy, sortOrder };
};
exports.default = paginationHelper;
