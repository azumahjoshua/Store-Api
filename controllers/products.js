const Product = require("../models/product");
const getAllProductsStatic = async (req, res) => {
	// const search = "b";
	const product = await Product.find({
		// name: { $regex: search, $options: "i" },
		price: { $gt: 50 },
		reating: { $gte: 4.5 },
	})
		.sort("name")
		.select("name price reating")
		.limit(10);
	res.status(200).json({ product, nbHits: product.length });
};

const getAllProducts = async (req, res) => {
	// console.log(req);
	const { featured, company, name, sort, fields, numericFilters } = req.query;
	const queryObject = {};
	if (featured) {
		queryObject.featured = featured === "true" ? true : false;
	}
	if (company) {
		queryObject.company = company;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: "i" };
	}
	let result = Product.find(queryObject);
	if (sort) {
		const sortList = sort.split(",").join(" ");
		result = result.sort(sortList);
		// sortList = sort.split(',').join()
	} else {
		result = result.sort("createdAt");
	}

	if (fields) {
		const fieldsList = fields.split(",").join(" ");
		// console.log(fieldsList);
		result = result.sort(fieldsList);
	}
	// if (numericFilters) {
	// const optionMap = {
	// ">": "$gt",
	// ">=": "$gte",
	// "=": "$eq",
	// "<": "$lt",
	// "<=": "$lte",
	// };
	// const regEx = /\b(<|>|>=|=|<|<=)\b/g;
	// let filters = numericFilters.replace(regEx, (match) => {
	// `-${optionMap[match]}-`;
	// });
	// console.log(filters);
	// const options = ["price"];
	// filters = filters.split(",").forEach((element) => {
	// const [field, operator, value] = element.split("-");
	// if (options.includes(field)) {
	// queryObject[field] = { [operator]: Number(value) };
	// }
	// });
	// console.log(filters);
	// }
	// console.log(queryObject);
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);
	// console.log(result);
	const products = await result;
	res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
	getAllProducts,
	getAllProductsStatic,
};
