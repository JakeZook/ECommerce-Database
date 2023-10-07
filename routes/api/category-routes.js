const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
	try {
		const catData = await Category.findAll({
			include: [
				{
					model: Product,
					attributes: ["product_name"],
				},
			],
		});
		res.status(200).json(catData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const catData = await Category.findByPk(req.params.id, {
			include: [
				{
					model: Product,
					attributes: ["product_name"],
				},
			],
		});
		res.status(200).json(catData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", async (req, res) => {
	try {
		const newCat = await Category.create(req.body);
		res.status(201).json(newCat);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const categoryId = req.params.id;
		const { category_name } = req.body;

		const category = await Category.findByPk(categoryId);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		category.category_name = category_name;
		await category.save();

		res.json(category);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const categoryId = req.params.id;

		const category = await Category.findByPk(categoryId);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		await category.destroy();

		res.status(204).send();
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
