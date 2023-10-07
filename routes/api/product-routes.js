const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
	try {
		const productData = await Tag.findAll();
		res.status(200).json(productData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get one product
router.get("/:id", async (req, res) => {
	try {
		const productData = await Tag.findByPk(req.params.id);
		res.status(200).json(productData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// create new product
router.post("/", (req, res) => {
	/* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
	Product.create(req.body)
		.then((product) => {
			// if there's product tags, we need to create pairings to bulk create in the ProductTag model
			if (req.body.tagIds.length) {
				const productTagIdArr = req.body.tagIds.map((tag_id) => {
					return {
						product_id: product.id,
						tag_id,
					};
				});
				return ProductTag.bulkCreate(productTagIdArr);
			}
			// if no product tags, just respond
			res.status(200).json(product);
		})
		.then((productTagIds) => res.status(200).json(productTagIds))
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// update product
router.put("/:id", (req, res) => {
	// update product data
	Product.update(req.body, {
		where: {
			id: req.params.id,
		},
	})
		.then((product) => {
			if (req.body.tagIds && req.body.tagIds.length) {
				ProductTag.findAll({
					where: { product_id: req.params.id },
				}).then((productTags) => {
					// create filtered list of new tag_ids
					const productTagIds = productTags.map(({ tag_id }) => tag_id);
					const newProductTags = req.body.tagIds
						.filter((tag_id) => !productTagIds.includes(tag_id))
						.map((tag_id) => {
							return {
								product_id: req.params.id,
								tag_id,
							};
						});

					// figure out which ones to remove
					const productTagsToRemove = productTags
						.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
						.map(({ id }) => id);
					// run both actions
					return Promise.all([
						ProductTag.destroy({ where: { id: productTagsToRemove } }),
						ProductTag.bulkCreate(newProductTags),
					]);
				});
			}

			return res.json(product);
		})
		.catch((err) => {
			// console.log(err);
			res.status(400).json(err);
		});
});

router.delete("/:id", async (req, res) => {
	try {
		const productId = req.params.id;

		const product = await Tag.findByPk(productId);

		if (!product) {
			return res.status(404).json({ error: "Tag not found" });
		}

		await product.destroy();

		res.status(204).send();
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
