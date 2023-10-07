const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
	try {
		const tagData = await Tag.findAll({
			include: [
				{
					model: Product,
					attributes: ["product_name"],
				},
			],
		});
		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const tagData = await Tag.findByPk(req.params.id, {
			include: [
				{
					model: Product,
					attributes: ["product_name"],
				},
			],
		});
		res.status(200).json(tagData);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/", async (req, res) => {
	try {
		const newTag = await Tag.create(req.body);
		res.status(201).json(newTag);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const tagId = req.params.id;
		const { tag_name } = req.body;

		const tag = await Tag.findByPk(tagId);

		if (!tag) {
			return res.status(404).json({ error: "Tag not found" });
		}

		tag.tag_name = tag_name;
		await tag.save();

		res.json(tag);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const tagId = req.params.id;

		const tag = await Tag.findByPk(tagId);

		if (!tag) {
			return res.status(404).json({ error: "Tag not found" });
		}

		await tag.destroy();

		res.status(204).send();
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
