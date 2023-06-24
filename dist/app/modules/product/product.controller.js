"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const product_service_1 = require("./product.service");
const customResponse_1 = require("../../../shared/customResponse");
const pick_1 = __importDefault(require("../../../shared/pick"));
const product_constant_1 = require("./product.constant");
const shared_constant_1 = require("../../../constant/shared.constant");
const http_status_1 = __importDefault(require("http-status"));
const convertImageToWebp_1 = __importDefault(require("../../helpers/convertImageToWebp"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('controller');
    const productData = req.body;
    const uploadedFiles = req.files;
    if (Object.keys(uploadedFiles).length !== 0) {
        const frontImageWebP = uploadedFiles.frontImage.map((file) => `${(0, convertImageToWebp_1.default)(file.filename)}`);
        const backImageWebP = uploadedFiles.backImage.map((file) => `${(0, convertImageToWebp_1.default)(file.filename)}`);
        const restImageWebP = uploadedFiles.restImage.map((file) => `${(0, convertImageToWebp_1.default)(file.filename)}`);
        productData.frontImage = frontImageWebP[0];
        productData.backImage = backImageWebP[0];
        productData.restImage = restImageWebP;
    }
    const product = yield product_service_1.ProductService.createProduct(productData);
    const responseData = {
        message: 'Product created successfully',
        data: product,
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
});
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const productData = req.body;
    const product = yield product_service_1.ProductService.updateProduct(productId, productData);
    const responseData = {
        message: 'Product updated successfully',
        data: product,
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
}));
const getAllProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, ['searchTerm', ...product_constant_1.PRODUCT_FILTER_FIELDS]);
    const paginationOption = (0, pick_1.default)(req.query, shared_constant_1.paginationFields);
    const result = yield product_service_1.ProductService.getAllProduct(filters, paginationOption);
    const responseData = {
        statusCode: http_status_1.default.OK,
        meta: result.meta || {},
        data: result.data || [],
        message: 'All users fetched successfully',
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
}));
const getProductById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield product_service_1.ProductService.getProductById(productId);
    const responseData = {
        message: 'Product fetched successfully',
        data: product,
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
}));
const getProductByPath = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productPath = req.params.path;
    const product = yield product_service_1.ProductService.getProductByPath(productPath);
    const responseData = {
        message: 'Product fetched successfully',
        data: product,
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.id;
    const product = yield product_service_1.ProductService.deleteProduct(productId);
    const responseData = {
        message: 'Product deleted successfully',
        data: product,
    };
    (0, customResponse_1.sendSuccessResponse)(res, responseData);
}));
exports.ProductController = {
    createProduct,
    updateProduct,
    getAllProduct,
    getProductById,
    getProductByPath,
    deleteProduct,
};