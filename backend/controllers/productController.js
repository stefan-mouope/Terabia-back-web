const { Product, User } = require("../models");
const cloudinary = require('cloudinary').v2;

exports.createProduct = async (req, res) => {
  try {
    console.log("req.files →", req.files);
    console.log("req.body →", req.body);

    // Extraire les URLs Cloudinary des fichiers uploadés
    const images = req.files 
      ? req.files.map(file => file.path) // file.path contient l'URL Cloudinary
      : [];

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock) || 0,
      category_id: parseInt(req.body.category_id),
      seller_id: req.body.seller_id || req.user?.id,
      images: images, // URLs Cloudinary
    };

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Erreur création produit:", error);
    
    // Nettoyer les images uploadées en cas d'erreur
    if (req.files) {
      req.files.forEach(async (file) => {
        try {
          // Extraire le public_id de l'URL Cloudinary
          const publicId = file.filename; // ou utilisez file.public_id si disponible
          await cloudinary.uploader.destroy(publicId);
        } catch (cleanupError) {
          console.error("Erreur nettoyage image:", cleanupError);
        }
      });
    }
    
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params; // LÀ ÉTAIT LE BUG PRINCIPAL !

    if (!id) {
      return res.status(400).json({ success: false, error: "ID manquant" });
    }

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: "seller",
          attributes: ["id", "name", "phone"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Produit non trouvé" });
    }

    // On renvoie un objet propre, sans les métadonnées Sequelize
    res.status(200).json({
      success: true,
      data: {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description || "",
        images: product.images || [],
        stock: product.stock || 0,
        unit: product.unit || null,
        location_city: product.location_city || "Yaoundé",
        seller_id: product.seller_id,
        seller: product.seller
          ? {
              id: product.seller.id,
              name: product.seller.name || "Vendeur anonyme",
              phone: product.seller.phone || null,
            }
          : null,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error("Erreur getProductById:", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updatedRows] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const updatedProduct = await Product.findByPk(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedRows = await Product.destroy({
      where: { id: req.params.id },
    });
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsBySellerId = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { seller_id: req.params.seller_id },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
