const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Endpoint para crear un usuario
router.post('/', async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log de los datos recibidos

        const newUser = new User(req.body);

        const savedUser = await newUser.save();

        res.status(201).json({ success: true, data: savedUser });
       
       
    } catch (err) {
        // Manejar errores
        if (err.code === 11000) { // Código de error para duplicados
            console.error('Error: El correo ya está registrado.');
            res.status(400).json({ success: false, message: 'El correo ya está registrado.' });
        } else {
            console.error('Error al guardar el usuario:', err);
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }
});

// Endpoint para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
      const users = await User.find().select('name email');
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

router.get('/manyget', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

// Endpoint para actualizar un usuario
router.put('/update/:email', async (req, res) => {
  const { email } = req.params; // Capturamos el email de la URL
  const { name, lastname, phone, password, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Usamos findOneAndUpdate para actualizar el usuario por su email
    const user = await User.findOneAndUpdate(
      { email },
      { name, lastname, phone, password, role },
      { new: true }  // Devuelve el usuario actualizado
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Devolvemos el usuario actualizado
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



  router.delete('/delete', async (req, res) => {
    try {
        const { email } = req.query;  // Obtener el email desde la consulta
        const user = await User.findOneAndDelete({ email: email });

        if (user) {
            res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/getbyemail', async (req, res) => {
  try {
      const { email } = req.query;

      // Validar si se envió el parámetro email
      if (!email) {
          return res.status(400).json({
              success: false,
              message: "El correo electrónico es requerido."
          });
      }

      // Buscar al usuario en la base de datos
      const user = await User.findOne({ email });

      // Validar si el usuario existe
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "Usuario no encontrado."
          });
      }

      // Devolver los datos del usuario
      res.status(200).json({
          success: true,
          data: {
              name: user.name,
              lastname: user.lastname,
              email: user.email,
              phone: user.phone,
              rol: user.rol,
              password: user.password
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Error al obtener el usuario."
      });
  }
});

router.post('/many', async (req, res) => {
  try {
      const users = req.body; 
      const savedUsers = await User.insertMany(users);  // many(muchos datos insertados)
      res.status(201).json({ success: true, data: savedUsers });
  } catch (error) {
      res.status(400).json({ success: false, message: error.message });
  }
});


//buscar 
router.get("/search", async (req, res) => {
  try {
    const query = req.query.key; // Obtener el término de búsqueda
    const users = await User.find({
      $or: [
        {name:  {$regex: query, $options: "i"}}, 
        {rol:   {$regex: query, $options: "i"}}, 
        {phone: {$regex: query, $options: "i"}},
        {email: {$regex: query, $options: "i"}} //
      ]
  }).select("name email"); // Solo devolver name y email

    res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Error al buscar usuarios", error });
  }
});



module.exports = router;
