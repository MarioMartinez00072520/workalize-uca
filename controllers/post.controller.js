const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Tag = require("../models/Tag.model")
const debug = require("debug")("app:post-controller");

const controller = {};

//Create que necesita autenticacion y autorizacion
controller.create = async (req, res) => {
  try {
    const { title, description, employer, availability, requirements, level, location} = req.body;
    const { _id: userId } = req.user;

    const post = new Post({
      title: title,
      description: description,
      employer: employer,
      availability: availability,
      requirements: requirements,
      level: level,
      location: location,
      user: userId
    });

    const newPost = await post.save();

    if (!newPost) {
      return res.status(409).json({ error: "Ocurrio un error al crear el post." });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findAll = async (req, res) => {
  try {
    const posts = 
      await Post
        .find({ hidden: false })
        .populate("user", "username email")
        .populate("likes", "username email");

    return res.status(200).json({ posts });
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findOwn =  async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const posts = 
      await Post
        .find({ user: userId })
        .populate("user", "username email")
        .populate("likes", "username email");

    return res.status(200).json({ posts });

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findPostsByKeyword = async (req, res) => {
  //puede dar error al momento de que en la ruta se pase un string con espacios porque en las rutas los espacios son &20 y asi
  try {
    const { keyword } = req.params;

    const posts = await Post.find(
      { $and: [ 
        {hidden: false}, 
        {$or: [ 
          { title:        { $regex: keyword, $options: 'i'}},
          { description:  { $regex: keyword, $options: 'i'}},
          { employer:     { $regex: keyword, $options: 'i'}},
          { requirements: { $regex: keyword, $options: 'i'}},
          { level: { $regex: keyword, $options: 'i'}},
          { location: { $regex: keyword, $options: 'i'}},
          { requirements: { $regex: keyword, $options: 'i'}}
      ]}]
    })

    if(!posts){
      return res.status(404).json({error: "No hay posts que se asemejen a tu busqueda"})
    };

    return res.status(200).json({ posts });
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findPostByFilter = async (req, res) => {
  try {
    const { filter, ...values } = req.params;

    debug({ values });

    /* const posts = await Post.find({}) */

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findPostsByUser = async (req, res) => {
  try {
    const { identifier } = req.params;

    const posts = await Post.find({ user: identifier, hidden: false });

    if(!posts) return res.status(404).json({ error: "No hay posts afiliados a este usuario." })

    return res.status(200).json({ posts })

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.findOneById = async (req, res) => {
  try {
    const { identifier } = req.params;

    const post = 
      await Post
        .findOne({ _id: identifier, hidden: false})
        .populate("user", "username email")
        .populate("likes", "username email");

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    
    return res.status(200).json(post);
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.getOwnSavedPosts =  async (req, res) => {
  try {
    
    const { _id } = req.user;

    const user =
      await User.findById(_id)
        .populate("savedPosts");
    
    return res.status(200).json({ posts: user.savedPosts.filter(post => !post.hidden)})
    
  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.togglePostVisibility = async (req, res) => {
  try {

    const { identifier: postId } = req.params;

    const { _id: userId} = req.user;

    //Paso 1: Obtener el post
    //Paso 2: Verficamos la pertenencia del post al usuario
    const post = await Post.findOne({ _id: postId, user: userId });

    if(!post) return res.status(404).json({ error: "Post no encontrado. "});
    
    //Paso 3: Modifico el valor
    post.hidden = !post.hidden;

    //Paso 4: Guardo los cambios
    await post.save();

    return res.status(200).json({ message: "Post actualizado. "})

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.togglePostLike = async (req, res) => {
  try {
    const { identifier: postId } = req.params;

    const { _id: userId} = req.user;

    //Paso 1: Obtener el post (id, hidden: false)

    const post = 
      await Post
        .findOne({ _id: postId, hidden: false})
        .populate("user", "username email")
        .populate("likes", "username email");

    if(!post) return res.status(404).json({ error: "Post no encontrado. "});


    //Paso 2: Determinar si debo añadir o quitar un like
    const index = post.likes.findIndex( _userId => _userId.equals(userId));

    // Paso 3: Ejecutar el toggle
    if(index >= 0 ){
      //quitar like
      post.likes = post.likes.filter(_userId => !_userId.equals(userId));
    }else{
      //poner like
      post.likes = [...post.likes, userId];
    }

    //Paso3: Guardar los cambios

    await post.save();

    return res.status(200).json({message: "Post actualizado"})


  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

/* controller.toggleSavedPost = async (req, res) => {
  try {
    const { identifier: postId } = req.params;

    const { user } = req;

    //Paso 1: Buscar el post(id, hidden: false)
    const post = await Post.findOne({ _id: postId, hidden: false });

    if(!post) return res.status(404).json({ error: "Post no encontrado." });

    //Paso 2: Determinar si debo guardar o quitar
    const index = user.savedPosts.findIndex(_postId => _postId.equals(post._id));

    if(index >= 0){
      //Quitar de SavedPosts
      user.savedPosts = user.savedPosts.filter(_postId => !_postId.equals(post._id));

    } else {
      //Agregar a SavedPosts
      user.savedPosts = [...user.savedPosts, post._id];
    }

    await user.save();

    return res.status(200).json({ message: "Post guardado"})

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
} */

controller.toggleTaggedPost = async (req,res) => {
  try {
    const { name: tagId, identifier: postId } = req.params;

    //Paso 1: Buscar el post(id, hidden: false)
    const post = await Post.findOne({ _id: postId, hidden: false });

    if(!post) return res.status(404).json({ error: "Post no encontrado." });

    const tag = await Tag.findOne({ _id: tagId})

    if(!tag) return res.status(404).json({error: "La etiqueta no ha sido encontrada."})
    //Paso 2: Determinar si debo guardar o quitar
    const index = tag.taggedPosts.findIndex(_postId => _postId.equals(post._id));

    if(index >= 0){
      //Quitar de SavedPosts
      tag.taggedPosts = tag.taggedPosts.filter(_postId => !_postId.equals(post._id));

    } else {
      //Agregar a SavedPosts
      tag.taggedPosts = [...tag.taggedPosts, post._id];
    }

    await tag.save();

    return res.status(200).json({ message: "Post guardado."})

  } catch (error) {
    debug({ error });
    return res.status(500).json({ error: "Error interno de servidor." });
  }
}

controller.updatePost = async (req, res) => {
  /* try {
    
    const { area, availability, location, salary } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);

    user.preferences.area = area || "No preference. ";
    user.preferences.availability = availability || "No preference. ";
    user.preferences.location = location || "No preference. ";
    user.preferences.salary = salary || "No preference. ";

    await user.save();

    return res.status(200).json({ message: "Los cambios han sido exitosos. "})

  } catch (error) {
    debug(error);
    return res.status(500).json({ error: "Error inesperado del servidor." })
  } */
}

module.exports = controller;